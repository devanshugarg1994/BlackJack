import { GameModel } from "../GameModel";
import { CustomEventConstant } from "../constants/EventConstant";
import { BlackJack } from "../constants/GameConstants";
import { HelperTextView } from "./HelperTextView";

export class HelperTextController {
    constructor(winPresentationView: HelperTextView, gameModel: GameModel) {
        this.winPresentationView = winPresentationView;
        this.gameModel = gameModel;
        this.subscribeEvents();
    }

    protected subscribeEvents() {
        this.unSubscribeEvents();
        window.addEventListener(CustomEventConstant.SHOW_WIN_PRESENTATION, this.showWinLoseTxt.bind(this) as EventListener);
        window.addEventListener(CustomEventConstant.HIDE_WIN_PRESENTATION, this.hideWInLoseTxt.bind(this) as EventListener);
        window.addEventListener(CustomEventConstant.SHOW_HIDE_HELPER_TXT, this.showHideHelperTxt.bind(this) as EventListener);
    }

    protected unSubscribeEvents() {
        window.removeEventListener(CustomEventConstant.SHOW_WIN_PRESENTATION, this.showWinLoseTxt.bind(this) as EventListener);
        window.removeEventListener(CustomEventConstant.HIDE_WIN_PRESENTATION, this.hideWInLoseTxt.bind(this) as EventListener);
        window.addEventListener(CustomEventConstant.SHOW_HIDE_HELPER_TXT, this.showHideHelperTxt.bind(this) as EventListener);

    }

    private showWinLoseTxt(): void {
        let txt: string;
        if (this.gameModel.getBlackJack()!== BlackJack.None) {
            txt = this.gameModel.getBlackJack() === BlackJack.Win ? "Black Jack Win" : "Black Jack Lose"
        } else {
            txt = this.gameModel.getResult()
        }
        this.winPresentationView.showWinLoseTxt(txt);
    }

    private showHideHelperTxt(event: CustomEvent) {
        const show = event?.detail?.value;
        this.winPresentationView.showHideMinimumBetTxt(show)

    }

    private hideWInLoseTxt() {
        this.winPresentationView.hideWinLoseTxt();
    }

    private winPresentationView: HelperTextView;
    private gameModel: GameModel
}