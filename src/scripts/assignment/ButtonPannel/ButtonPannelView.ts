import { BasicNode } from "../../UiComponent/BasicNode";

export class ButtonPannelView extends BasicNode {
    constructor(json: any) {
        super(json)
    }

    protected resize(_evt?: Event | undefined): void {
        // this.pivot.set(1280 / 2,720 / 2);
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        const scale = Math.min(innerWidth / 1280, innerHeight / 720);
        this.scale.set(scale, scale);
        _evt?.preventDefault();
    }
}