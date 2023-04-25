import { Container } from "../../UiComponent/Container";
import { Assets } from "../../Assets";
import { BasicNode } from "../../UiComponent/BasicNode";
import { Sprite } from "../../UiComponent/Sprite";
import { game } from "../../main";
import { GameContants, PlayerType, PosConstant } from "../constants/GameConstants";
import GSAP from "gsap";
import { Label } from "../../UiComponent/Label";
import { GameModel } from "../GameModel";
import { CustomEventConstant } from "../constants/EventConstant";


export class CardDeckView extends BasicNode {
    constructor(json: any) {
        super(json);
    }

    protected resize(_evt?: Event | undefined): void {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        const scale = Math.min(innerWidth / 1280, innerHeight / 720);
        this.scale.set(scale, scale);
        _evt?.preventDefault();
    }

    init(calculateCardInitialValue: () => void, gameModel: GameModel) {
        this.gameModel = gameModel;
        this.flippedCardConatiner = this.getContainerRefrences("flippedCardContainer");
        this.faceUpContainer = this.getContainerRefrences("faceUpContainer");
        this.userPoints = this.getLabelRefrences("userScoreValue");
        this.dealerPoints = this.getLabelRefrences("dealerScoreValue");
        this.calculateCardInitialValue = calculateCardInitialValue;
    }


    public startGame() {
        if (!this.flipCardData) {
            // Caching Flip Card Data so do no need ro fecth again and agin
            this.flipCardData = game.loader.resources[Assets.getInstance().getRelativePath("flippedCardData")]?.data.flippedCardData.flippedCardBasicData;
            console.log(this.flipCardData);
        }
        this.openingCards();

    }

    private openingCards() {
        for (let i: number = 1; i <= GameContants.INITIAL_USER_CARDS; i++) {
            this.createNewFlippedCard(this.flippedUserCards, PlayerType.User);
        }
        for (let i: number = 1; i <= GameContants.INITIAL_DEALER_CARDS; i++) {
            this.createNewFlippedCard(this.flippedDealerCards, PlayerType.Dealer);
        }
        this.moveOpeneingCards(this.flippedUserCards, PlayerType.User, () => {
            this.moveOpeneingCards(this.flippedDealerCards, PlayerType.Dealer, this.onAnimationComplete.bind(this));
        });
    }

    private createNewFlippedCard(flippedCards: Sprite[], keyPrefix: string) {
        const flipCardData = JSON.parse(JSON.stringify(this.flipCardData));
        const card = new Sprite(this.flipCardData);
        this.flippedCardConatiner.addChild(card);
        flipCardData.id = "card_" + keyPrefix + flippedCards.length;
        flippedCards.push(card);
    }


    private moveOpeneingCards(flippedCards: Sprite[], playerType: PlayerType, onAnimationCompleteCallback: () => void, index: number = 0) {
        if (index >= flippedCards.length) {
            onAnimationCompleteCallback && onAnimationCompleteCallback();
            return;
        }
        const processingCard = flippedCards[index];
        this.flippedCardConatiner.addChildAt(processingCard, this.flippedCardConatiner.children.length)
        let posX;
        if (playerType === PlayerType.User) {
            posX = (PosConstant.User_Reveal_Card_PosX + (index * 30));
        } else {
            posX = (PosConstant.Dealer_Reveal_Card_PosX + (index * 30));
        }
        index++;
        GSAP.to(processingCard, { duration: 2, x: posX, y: -120, yoyo: false, repeat: 0 })
            .eventCallback("onComplete", this.moveOpeneingCards.bind(this), [flippedCards, playerType, onAnimationCompleteCallback, index]);

    }



    showInitialCards(cardID: number[], dealerCards: boolean = false, indexOffset: number = 0, callback?: () => void) {
        let index = indexOffset;
        for (const id of cardID) {
            const cardData = game.loader.resources[Assets.getInstance().getRelativePath("cardshow")]?.data.cardshow;
            cardData.id = cardData.id + id;
            cardData.image = "card" + id;
            const card = new Sprite(cardData);
            const flipCard = dealerCards ? this.flippedDealerCards[index] : this.flippedUserCards[index];
            card.position.set(flipCard.x, flipCard.y);
            dealerCards ? this.dealerRevealCards.push(card) : this.userRevealCards.push(card)
            this.faceUpContainer.addChildAt(card, this.faceUpContainer.children.length);
            index++;
            if(dealerCards) break; 
        }
        this.userPoints.text = this.gameModel.getUserScore().toString();
        this.dealerPoints.text = this.gameModel.getDealerScore().toString();
        callback && callback();
    }


    private onAnimationComplete() {
        GSAP.delayedCall(3, () => {
            this.calculateCardInitialValue();
            this.userPoints.text = this.gameModel.getUserScore().toString();
            this.dealerPoints.text = this.gameModel.getDealerScore().toString();
            window.dispatchEvent(new CustomEvent(CustomEventConstant.ENABLE_DISABLE_BUTTONS, {
                detail: {
                    value: true
                }
            }));
            window.dispatchEvent(new CustomEvent(CustomEventConstant.DISABLE_COIN, {
                detail: {
                    value: true
                }
            }));
        });
    }

    showNewCardOnHit(playerType: PlayerType, cardID: number, callback?: () => void) {
        const userFlippedCardLastIndex: number = this.flippedUserCards.length - 1;
        const dealerFlippedCardLastIndex: number = this.flippedDealerCards.length - 1;
        let processingCard: Sprite;
        let posX: number;
        let offsetIndex: number;
        if (playerType === PlayerType.User) {
            processingCard = this.flippedUserCards[userFlippedCardLastIndex];
            posX = (PosConstant.User_Reveal_Card_PosX + ((this.userRevealCards.length) * 30));
            offsetIndex = userFlippedCardLastIndex;
        } else {
            processingCard = this.flippedDealerCards[dealerFlippedCardLastIndex]
            posX = (PosConstant.Dealer_Reveal_Card_PosX + ((this.dealerRevealCards.length) * 30));
            offsetIndex = dealerFlippedCardLastIndex;
        }

        processingCard.position.set(PosConstant.Flipped_Card_PosX, PosConstant.Flipped_Card_posY);
        this.faceUpContainer.addChildAt(processingCard, this.faceUpContainer.children.length);
        GSAP.to(processingCard, { duration: 3, x: posX, y: -120, yoyo: false, repeat: 0 })
            .eventCallback("onComplete", (cardID: number) => {
                this.showInitialCards([cardID], playerType === PlayerType.Dealer, offsetIndex, callback)
            }, [cardID]);

    }

    showDealerFaceDownCard(cardID: number, callback: () => void) {
        const dealerFlippedCardLastIndex: number = this.flippedDealerCards.length - 1;
        this.showInitialCards([cardID], true, dealerFlippedCardLastIndex, callback)
    }

    reset() {
        this.userRevealCards.forEach((element: Sprite) => {
            element.destroy();
        }, this);
        this.dealerRevealCards.forEach((element: Sprite) => {
            element.destroy();
        }, this);
        this.flippedUserCards.forEach((element: Sprite) => {
            element.x = PosConstant.Flipped_Card_PosX;
            element.y = PosConstant.Flipped_Card_posY;
        });
        this.flippedDealerCards.forEach((element: Sprite) => {
            element.x = PosConstant.Flipped_Card_PosX;
            element.y = PosConstant.Flipped_Card_posY;
        });

        this.flippedUserCards.length = 0;
        this.flippedDealerCards.length = 0;
        this.userRevealCards.length = 0;
        this.dealerRevealCards.length = 0;

        this.userPoints.text = "0";
        this.dealerPoints.text = "0";
    }



    private flipCardData: any;
    //Flipped cards
    private flippedUserCards: Sprite[] = [];
    private flippedDealerCards: Sprite[] = [];
    // Revealed Cards
    private userRevealCards: Sprite[] = [];
    private dealerRevealCards: Sprite[] = [];
    //Points
    private userPoints: Label;
    private dealerPoints: Label;
    private gameModel: GameModel;

    private calculateCardInitialValue: () => void;
    private flippedCardConatiner: Container;
    private faceUpContainer: Container;
}