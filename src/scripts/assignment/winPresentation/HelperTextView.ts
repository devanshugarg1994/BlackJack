import { BasicNode } from "../../UiComponent/BasicNode";
import { Label } from "../../UiComponent/Label";
import GSAP, { Bounce } from "gsap";
import { CustomEventConstant } from "../constants/EventConstant";

export class HelperTextView extends BasicNode {
    constructor(json: any) {
        super(json);
        this.init();
    }


    init() {
        this.winLoseTxt = this.getLabelRefrences("winloseTxt");
        this.userHelperTxt = this.getLabelRefrences("userHelperTxt");
    }

    protected resize(_evt?: Event | undefined): void {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        const scale = Math.min(innerWidth / 1280, innerHeight / 720);
        this.scale.set(scale, scale);
        _evt?.preventDefault();
    }


    showWinLoseTxt(txt: string) {
        this.winLoseTxt.scale.set(0, 0);
        this.winLoseTxt.text = txt;
        GSAP.to(this.winLoseTxt.scale, { duration: 2, x: 1, y:1, yoyo: false, repeat: 0, ease: "expo.out" })
            .eventCallback("onComplete", () => {
                window.dispatchEvent(new CustomEvent(CustomEventConstant.UPDATE_METER_ON_RESULT));

            });
        }

        hideWinLoseTxt() {
            GSAP.to(this.winLoseTxt.scale, { duration: 2, x: 0, y: 0, yoyo: false, repeat: 0, ease: "expo.out" })
                .eventCallback("onComplete", () => {
                    window.dispatchEvent(new CustomEvent(CustomEventConstant.RESET_ON_PRESENTATION_COMPLETE));
                }, []);

        }

        showHideMinimumBetTxt(value: boolean) {
            this.userHelperTxt.visible = value;

        }


    private winLoseTxt: Label
    private userHelperTxt: Label



}