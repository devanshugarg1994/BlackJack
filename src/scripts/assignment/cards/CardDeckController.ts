import { shuffleArray } from "../../ArrayUtlis";
import { GameModel } from "../GameModel";
import { CardDeckView } from "./CardDeckView";
import { CustomEventConstant } from "../constants/EventConstant";
import { BlackJack, PlayerType, Result } from "../constants/GameConstants";

export class CardDeckController {
    constructor(cardView: CardDeckView, gameModel: GameModel) {
        this.cardView = cardView;
        this.gameModel = gameModel;
        this.subscribeEvents();
        this.cardView.init(this.calculateCardInitialValue.bind(this), this.gameModel);
        this.initCardIDs();
    }

    protected subscribeEvents() {
        this.unSubscribeEvents();
        window.addEventListener(CustomEventConstant.SHOW_NEW_CARDS, this.showNewCardonHit.bind(this) as EventListener);
        window.addEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.reset.bind(this));

    }

    protected unSubscribeEvents() {
        window.removeEventListener(CustomEventConstant.SHOW_NEW_CARDS, this.showNewCardonHit.bind(this) as EventListener);
        window.removeEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.reset.bind(this));

    }

    startGame() {
        window.dispatchEvent(new CustomEvent(CustomEventConstant.DISABLE_COIN, {
            detail: {
                value: false
            }
        }));
        this.cardView.startGame();
    }

    protected calculateCardInitialValue(): void {
        this.playerInitalCards();
        this.dealerInitialCards();

    }

    protected playerInitalCards() {
        for (let i: number = 0; i < 2; i++) {
            const cardID: number = this.findInitialRandomCard();
            this.gameModel.setUserCardrData(cardID);
        }

        const score = this.calaculatePoints(this.gameModel.getUserCardData());
        this.gameModel.setUserScore(score);
        this.cardView.showInitialCards(this.gameModel.getUserCardData());
        if (this.checkForBlackJack(false)) {
            this.gameModel.setResult(Result.Win);
            this.gameModel.setBlackJack(BlackJack.Win)
            window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_WIN_PRESENTATION))

        }

    }


    protected dealerInitialCards() {
        for (let i: number = 0; i < 2; i++) {
            const cardID: number = this.findInitialRandomCard();
            this.gameModel.setDealerCardrData(cardID);
        }

        const score = this.calaculatePoints([this.gameModel.getDealerCardData()[0]]);
        this.gameModel.setDealerScore(score);
        this.cardView.showInitialCards(this.gameModel.getDealerCardData(), true);
        if (this.checkForBlackJack(true)) {
            this.gameModel.setResult(Result.Lose);
            this.gameModel.setBlackJack(BlackJack.Lose)
            this.showDealerFaceDownCard(() => {
                window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_WIN_PRESENTATION))
            });
        }

    }


    private checkForBlackJack(dealer: boolean) {
        const cardData: number[] = dealer ? this.gameModel.getDealerCardData() : this.gameModel.getUserCardData();
        let faceCard: boolean = false;
        let ace: boolean = false;
        cardData.forEach((element: number) => {
            const cardFaceValue = element % 13
            if (cardFaceValue === 1) {
                ace = true;
            }
            if (cardFaceValue === 11 || cardFaceValue === 10 || cardFaceValue === 12 || cardFaceValue === 0) {
                faceCard = true
            }
        }, this);
        return (ace && faceCard);
    }

    protected findInitialRandomCard(): number {
        return this.findRandomCard();
    }

    protected findRandomCard() {
        shuffleArray(this.cardId);
        this.cardId.splice(0, 1);
        return this.cardId[0];

    }

    private initCardIDs() {
        this.cardId = [];
        for (let i: number = 0; i < 52; i++) {
            this.cardId.push(i + 1);
        }
        shuffleArray(this.cardId);

    }

    protected showNewCardonHit(event?: CustomEvent) {
        window.dispatchEvent(new CustomEvent(CustomEventConstant.ENABLE_DISABLE_BUTTONS, {
            detail: {
                value: false
            }
        }));
        window.dispatchEvent(new CustomEvent(CustomEventConstant.DISABLE_COIN, {
            detail: {
                value: false
            }
        }));
        const cardID: number = this.findInitialRandomCard();
        if (this.gameModel.getPlayerTurn() === PlayerType.User) {
            this.gameModel.setUserCardrData(cardID);
            const score = this.calaculatePoints(this.gameModel.getUserCardData());
            this.gameModel.setUserScore(score);
            this.cardView.showNewCardOnHit(PlayerType.User, cardID, this.userHitting.bind(this));
        } else {
            const turnChange = event?.detail?.turnChange;
            if (turnChange) {
                this.showDealerFaceDownCard(this.dealerHitting.bind(this));
            } else {
                this.gameModel.setDealerCardrData(cardID);
                const score = this.calaculatePoints(this.gameModel.getDealerCardData());
                this.gameModel.setDealerScore(score);
                this.cardView.showNewCardOnHit(PlayerType.Dealer, cardID, this.dealerHitting.bind(this));
            }
        }
    }

    private showDealerFaceDownCard(callback: () => void) {
        const cardID = this.gameModel.getDealerCardData()[1];
        const score = this.calaculatePoints(this.gameModel.getDealerCardData());
        this.gameModel.setDealerScore(score);
        this.cardView.showDealerFaceDownCard(cardID, callback);

    }

    protected calaculatePoints(cardData: number[]) {
        let hasAce: boolean = false;
        let sum = 0;
        cardData.forEach((value: number) => {
            const cardpoint = this.calaculateCardValue(value)
            sum += cardpoint;
            if (cardpoint === 1) {
                hasAce = true;
            }
        });
        if (hasAce) {
            if ((sum + 10) < 21) {
                sum += 10;
            }
        }
        return sum;
    }

    protected calaculateCardValue(id: number): number {
        const cardFaceValue = id % 13;
        if (cardFaceValue === 11 || cardFaceValue === 12 || cardFaceValue === 0) {
            return 10;
        }
        return cardFaceValue;
    }

    private dealerHitting() {
        const dealerPoint = this.gameModel.getDealerScore();
        const userPoint = this.gameModel.getUserScore();
        if (dealerPoint > 21) {
            this.calculateWinLose();
            window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_WIN_PRESENTATION))
        } else if (dealerPoint < userPoint) {
            this.showNewCardonHit();
        } else {
            this.calculateWinLose();
            window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_WIN_PRESENTATION))
        }
    }

    private userHitting() {
        const userPoint = this.gameModel.getUserScore();
        if (userPoint > 21) {
            this.calculateWinLose();
            window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_WIN_PRESENTATION))
        } else {
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
        }
    }

    private calculateWinLose() {
        const userScore: number = this.gameModel.getUserScore();
        const dealerScore: number = this.gameModel.getDealerScore();
        if (userScore > 21) {
            this.gameModel.setResult(Result.Bust);
        } else if (dealerScore > 21 || dealerScore < userScore) {
            this.gameModel.setResult(Result.Win);
        } else if (dealerScore > userScore) {
            this.gameModel.setResult(Result.Lose);
        } else if (dealerScore === userScore) {
            this.gameModel.setResult(Result.Draw);
        }
    }

    private reset() {
        this.cardView.reset();
        this.gameModel.resetModel();
        this.initCardIDs();

    }

    protected cardView: CardDeckView;
    protected gameModel: GameModel;
    private cardId: number[] = []

}