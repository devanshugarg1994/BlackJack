import { Meter } from "../../UiComponent/Meter";
import { CustomEventConstant } from "../constants/EventConstant";
import { Result } from "../constants/GameConstants";
import { GameModel } from "../GameModel";
import { GameMetersView } from "./GameMetersView";
import GSAP from "gsap";

export class GameMetersController {
    constructor(gameMeterView: GameMetersView, gameModel: GameModel) {
        this.gameMeterView = gameMeterView;
        this.gameModel = gameModel;
        this.init();
        this.subscribeEvents();
    }


    private init() {
        this.winMeter = this.gameMeterView.getMeterRefrences("WinAmtMeter");
        this.creditMeter = this.gameMeterView.getMeterRefrences("creditAmtMeter");
        this.totalBet = this.gameMeterView.getMeterRefrences("betAmtMeter");
    }

    private subscribeEvents() {
        this.unSusbscribeEvents();
        window.addEventListener(CustomEventConstant.BET_PLACED, this.onBetPlaced.bind(this));
        window.addEventListener(CustomEventConstant.UPDATE_METER_ON_RESULT, this.updateMeters.bind(this));
    }

    private unSusbscribeEvents() {
        window.removeEventListener(CustomEventConstant.BET_PLACED, this.onBetPlaced.bind(this));
        window.removeEventListener(CustomEventConstant.UPDATE_METER_ON_RESULT, this.updateMeters.bind(this));
    }


    private updateMeters() {
        const winAmt = this.gameModel.getWinAmt();
        if(winAmt > 0) {
            this.gameModel.updateCredit(winAmt);
            this.winMeter.startTickUp(winAmt.toString(), () => {
                GSAP.delayedCall(1, () => {
                    this.creditMeter.text = this.gameModel.getCreditAmt().toString();
                    this.totalBet.text = "0";
                    this.winMeter.text = "0";
                    window.dispatchEvent(new CustomEvent(CustomEventConstant.HIDE_WIN_PRESENTATION));
                });
            }, this);
        } else  {
            if(this.gameModel.getResult() === Result.Draw) {
                this.gameModel.updateCredit(this.gameModel.getTotalBet());
            }
            this.creditMeter.text = this.gameModel.getCreditAmt().toString();
            this.totalBet.text = "0";
            this.winMeter.text = "0";
            window.dispatchEvent(new CustomEvent(CustomEventConstant.HIDE_WIN_PRESENTATION));
        } 

    }

    private onBetPlaced() {
        this.totalBet.text = this.gameModel.getTotalBet().toString();
        this.creditMeter.text = this.gameModel.getCreditAmt().toString();
    }

    private onClearingBet() {
        this.totalBet.text = this.gameModel.getTotalBet().toString();
        this.creditMeter.text = this.gameModel.getCreditAmt().toString();
    }

    private gameMeterView: GameMetersView;
    private gameModel: GameModel;
    private winMeter: Meter;
    private creditMeter: Meter;
    private totalBet: Meter;
}