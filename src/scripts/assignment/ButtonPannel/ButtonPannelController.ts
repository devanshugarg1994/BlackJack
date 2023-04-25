import { Button } from "../../UiComponent/Button";
import { Container } from "../../UiComponent/Container";
import { ShapeButton } from "../../UiComponent/ShapeButton";
import { CustomEventConstant, EventConstant } from "../constants/EventConstant";
import { MinimumBetPlacedToPlay, PlayerType } from "../constants/GameConstants";
import { GameModel } from "../GameModel";
import { ButtonPannelView } from "./ButtonPannelView";

export class ButtonPannelController {
    constructor(buttonPannelView: ButtonPannelView, gameModel: GameModel) {
        this.buttonPannelView = buttonPannelView;
        this.gameModel = gameModel;

        this.init();
        this.subscribeEvents();
        this.upadteButtonIntreactivity(false);
        this.disableEnableStartBtn(false);
    }

    private init() {
        this.hitBtn = this.buttonPannelView.getShapeButtonRefrences("hitBtn");
        this.standBtn = this.buttonPannelView.getShapeButtonRefrences("standBtn");
        this.startGameBtn = this.buttonPannelView.getShapeButtonRefrences("startGameBtn");
        this.betCoinContainer = this.buttonPannelView.getContainerRefrences("betCoinContainer");
        this.betOneBtn = this.buttonPannelView.getButtonRefrences("betCoin1");
        this.betTenBtn = this.buttonPannelView.getButtonRefrences("betCoin2");
        this.betHundredBtn = this.buttonPannelView.getButtonRefrences("betCoin3");
        this.betFiveHundredBtn = this.buttonPannelView.getButtonRefrences("betCoin4");
        this.betThousandBtn = this.buttonPannelView.getButtonRefrences("betCoin5");
    }


    private subscribeEvents() {
        this.unSubscribeEvents();
        this.hitBtn.registerEvent(EventConstant.POINTER_UP, this.hitBtnPressed.bind(this));
        this.standBtn.registerEvent(EventConstant.POINTER_UP, this.standBtnPressed.bind(this));
        this.startGameBtn.registerEvent(EventConstant.POINTER_UP, this.startGame.bind(this));
        // Bet Buttons
        this.betOneBtn.on(EventConstant.MOUSE_UP, this.betOnePressed.bind(this));
        this.betTenBtn.on(EventConstant.MOUSE_UP, this.betTenPressed.bind(this));
        this.betHundredBtn.on(EventConstant.MOUSE_UP, this.betHundredPressed.bind(this));
        this.betFiveHundredBtn.on(EventConstant.MOUSE_UP, this.betFiveHundredPressed.bind(this));
        this.betThousandBtn.on(EventConstant.MOUSE_UP, this.betThousandPressed.bind(this));
        window.addEventListener(CustomEventConstant.ENABLE_DISABLE_BUTTONS, this.buttonsInteractivty.bind(this) as EventListener);
        window.addEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.reset.bind(this) as EventListener);
        window.addEventListener(CustomEventConstant.DISABLE_COIN, this.disableCoin.bind(this) as EventListener);
    }


    private unSubscribeEvents() {
        this.hitBtn.unRegister(EventConstant.MOUSE_UP, this.hitBtnPressed.bind(this));
        this.standBtn.unRegister(EventConstant.MOUSE_UP, this.standBtnPressed.bind(this));
        this.startGameBtn.unRegister(EventConstant.MOUSE_UP, this.startGame.bind(this));
        // Bet Buttons
        this.betOneBtn.off(EventConstant.MOUSE_UP, this.betOnePressed.bind(this));
        this.betTenBtn.off(EventConstant.MOUSE_UP, this.betTenPressed.bind(this));
        this.betHundredBtn.off(EventConstant.MOUSE_UP, this.betHundredPressed.bind(this));
        this.betFiveHundredBtn.off(EventConstant.MOUSE_UP, this.betFiveHundredPressed.bind(this));
        this.betThousandBtn.off(EventConstant.MOUSE_UP, this.betThousandPressed.bind(this));
        window.removeEventListener(CustomEventConstant.ENABLE_DISABLE_BUTTONS, this.buttonsInteractivty.bind(this) as EventListener);
        window.removeEventListener(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE, this.reset.bind(this) as EventListener);
        window.addEventListener(CustomEventConstant.DISABLE_COIN, this.disableCoin.bind(this) as EventListener);


    }


    private hitBtnPressed() {
        window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_NEW_CARDS));
    }
    private standBtnPressed() {
        this.upadteButtonIntreactivity(false);
        this.gameModel.setPlayerTurn(PlayerType.Dealer);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_NEW_CARDS, {
            detail: {
                turnChange: true
            }
        }));
    }

    private disableCoin(event: CustomEvent) {
        const value: boolean = event.detail.value;
        if (value) {
            this.updateCoinAvalibilty();
        } else {
            this.betCoinContainer.children.forEach((element: PIXI.DisplayObject) => {
                (element as Button).interactive = false;
                (element as Button).buttonMode = false;
                (element as Button).tint = 0xababa6;
            });
        }
    }

    private updateCoinAvalibilty() {
        const creditAmt = this.gameModel.getCreditAmt();
        this.betCoinContainer.children.forEach((element: PIXI.DisplayObject, index: number) => {
            if (creditAmt < this.possibleBetAmt[index]) {
                (element as Button).interactive = false;
                (element as Button).buttonMode = false;
                (element as Button).tint = 0xababa6;
            } else {
                (element as Button).interactive = true;
                (element as Button).buttonMode = true;
                (element as Button).tint = 0xFFFFFF;

            }
        }, this);

        if (!this.minimumBetPlaced) {
            if(this.gameModel.getTotalBet() >= MinimumBetPlacedToPlay) {
                window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_HIDE_HELPER_TXT, {
                    detail: {
                        value: false
                    }
                }));
                this.minimumBetPlaced = true;
                this.disableEnableStartBtn(true);
            }
        }

    }

    private betOnePressed() {
        this.gameModel.updateTotalBet(this.possibleBetAmt[0]);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.BET_PLACED));
        this.updateCoinAvalibilty();
    }
    private betTenPressed() {
        this.gameModel.updateTotalBet(this.possibleBetAmt[1]);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.BET_PLACED));
        this.updateCoinAvalibilty();

    }

    private betHundredPressed() {
        this.gameModel.updateTotalBet(this.possibleBetAmt[2]);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.BET_PLACED));
        this.updateCoinAvalibilty();

    }

    private betFiveHundredPressed() {
        this.gameModel.updateTotalBet(this.possibleBetAmt[3]);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.BET_PLACED));
        this.updateCoinAvalibilty();

    }

    private betThousandPressed() {
        this.gameModel.updateTotalBet(this.possibleBetAmt[4]);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.BET_PLACED));
        this.updateCoinAvalibilty();

    }


    private buttonsInteractivty(event: CustomEvent) {
        const value: boolean = event.detail.value;
        this.upadteButtonIntreactivity(value);
    }

    private upadteButtonIntreactivity(value: boolean) {
        const alpha: number = value ? 1 : 0.7
        this.hitBtn.buttonMode = value;
        this.standBtn.buttonMode = value;

        this.hitBtn.interactive = value;
        this.standBtn.interactive = value;

        this.hitBtn.alpha = alpha
        this.standBtn.alpha = alpha

    }


    private disableEnableStartBtn(value: boolean) {
        this.startGameBtn.interactive = value;
        this.startGameBtn.buttonMode = value;
        const alpha: number = value ? 1 : 0.7
        this.startGameBtn.alpha = alpha;
    }

    private startGame() {
        this.disableEnableStartBtn(false);
        this.gameModel.setPlayerTurn(PlayerType.User);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.START_GAME));
    }

    private reset() {
        this.upadteButtonIntreactivity(false);
        this.disableEnableStartBtn(false);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_HIDE_HELPER_TXT, {
            detail: {
                value: true
            }
        }));

        this.updateCoinAvalibilty();
        this.minimumBetPlaced = false;

    }

    private buttonPannelView: ButtonPannelView;
    private hitBtn: ShapeButton;
    private standBtn: ShapeButton;
    private startGameBtn: ShapeButton;
    private betCoinContainer: Container;

    private betOneBtn: Button;
    private betTenBtn: Button;
    private betHundredBtn: Button;
    private betFiveHundredBtn: Button;
    private betThousandBtn: Button;
    private gameModel: GameModel;
    private possibleBetAmt: number[] = [1, 10, 100, 500, 1000];
    private minimumBetPlaced: boolean = false;

}