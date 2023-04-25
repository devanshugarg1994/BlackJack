import { Assets } from "../Assets";
import { Loader } from "../Engine/Loader";
import { game } from "../main";
import { GameModel } from "./GameModel";
import { MainScene } from "./MainScene";
import { CardDeckController } from "./cards/CardDeckController";
import { CustomEventConstant } from "./constants/EventConstant";
import { PlayerType } from "./constants/GameConstants";
import { GameMetersController } from "./meter/GameMetersController";
import { ButtonPannelController } from "./ButtonPannel/ButtonPannelController";
import { HelperTextController } from "./winPresentation/HelperTextController";


export class GamePlayContoller {
    constructor() {
        this.gameModel = new GameModel(PlayerType.User); // Composing insted of injecting because MainScene is entry point of our actual game logic
        this.loadCards();
    }

    private initViews() {
        this.mainScene = new MainScene(game.loader.resources[Assets.getInstance().getRelativePath("mainScene")]?.data.mainScene, this.gameModel);
        this.initControllers();
        this.subscribeEvents();
    }

    private initControllers() {
        this.buttonPannelController = new ButtonPannelController(this.mainScene.getButtonPannelView(), this.gameModel);
        this.gameMeterController = new GameMetersController(this.mainScene.getGameMeterView(), this.gameModel);
        this.cardDeckController = new CardDeckController(this.mainScene.getCardDeckView(), this.gameModel);
        this.helperTextController = new HelperTextController(this.mainScene.getHelperTextView(), this.gameModel);

    }

    private subscribeEvents() {
        this.unSubscribeEvents();
        window.addEventListener(CustomEventConstant.START_GAME, this.startGame.bind(this))

    }

    private unSubscribeEvents() {
        window.removeEventListener(CustomEventConstant.START_GAME, this.startGame.bind(this))
    }

    startGame() {
        window.dispatchEvent(new CustomEvent(CustomEventConstant.ENABLE_DISABLE_BUTTONS, {
            detail: {
                value: false
            }
        }));
        this.cardDeckController.startGame();
    }

    // Dynamic Loading of assest(On demand example) 
    private loadCards() {
        window.dispatchEvent(new CustomEvent(CustomEventConstant.SHOW_LOADING_SCREEN));
        const cards: string[] = [];
        for (let i: number = 1; i <= 52; i++) {
            cards.push("../images/cards/card" + i + ".png");
        }
        Loader.loadDynamic(cards, (this.initViews.bind(this)));
    }

    private gameModel: GameModel;
    private mainScene: MainScene;
    private buttonPannelController!: ButtonPannelController;
    private gameMeterController: GameMetersController;
    private cardDeckController: CardDeckController;
    private helperTextController: HelperTextController;




}