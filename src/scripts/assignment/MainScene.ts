import { Assets } from "../Assets";
import { game } from "../main";
import { BasicNode } from "../UiComponent/BasicNode";
import {  ButtonPannelView } from "./ButtonPannel/ButtonPannelView";
import { CardDeckView } from "./cards/CardDeckView";
import { CustomEventConstant } from "./constants/EventConstant";
import { GameModel } from "./GameModel";
import { GameMetersView } from "./meter/GameMetersView";
import { HelperTextView } from "./winPresentation/HelperTextView";


export class MainScene extends BasicNode {
    constructor(json: any, gameModel: GameModel) {
        super(json);
        this.gameModel = gameModel;
        this.init();
    }



    private init() {
        game.stage.addChildAt(this, 0);
        window.dispatchEvent(new CustomEvent(CustomEventConstant.HIDE_LOADING_SCREEN));
        this.initBettingAreaComponent();
        this.initgameMeterComponenets();
        this.initCardDeckComponents();
        this.initWinpresentationComponent()
    }



    private initBettingAreaComponent() {;
        this.buttonPannelView = new ButtonPannelView(game.loader.resources[Assets.getInstance().getRelativePath("buttonPannel")]?.data.buttonPannel);
        this.addChild(this.buttonPannelView);
    }

    private initgameMeterComponenets() {
        this.gameMeterView = new GameMetersView(game.loader.resources[Assets.getInstance().getRelativePath("gameMeter")]?.data.gameMeter);
        this.addChild(this.gameMeterView);
    }

    private initCardDeckComponents() {
        this.cardDeckView = new CardDeckView(game.loader.resources[Assets.getInstance().getRelativePath("cardDeck")].data.cardDeck)
        this.addChild(this.cardDeckView);
    }

    private initWinpresentationComponent() {
        this.helperTextView = new HelperTextView(game.loader.resources[Assets.getInstance().getRelativePath("helperText")].data.helperText)
        this.addChild(this.helperTextView);

    }

    getButtonPannelView(): ButtonPannelView {
        return this.buttonPannelView;
    }
    getGameMeterView(): GameMetersView {
        return this.gameMeterView;
    }
    getCardDeckView(): CardDeckView {
        return this.cardDeckView;
    }
    getHelperTextView(): HelperTextView {
        return this.helperTextView;
    }



    private buttonPannelView!: ButtonPannelView;
    private gameModel: GameModel;
    private gameMeterView: GameMetersView;
    private cardDeckView: CardDeckView;
    private helperTextView: HelperTextView;

}