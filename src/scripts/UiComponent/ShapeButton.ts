import { Container } from "./Container";
import { Label } from "./Label";
import { Shape } from "./Shape";
export class ShapeButton extends Container {

    constructor(json: any) {
        super(json);
        this.x = json.x;
        this.y = json.y;
        this.id = json.id;
        json.pivot && (this.pivot.set(json.pivot, json.pivot));
        (json.pivotX && json.pivotY) && (this.pivot.set(json.pivotX, json.pivotY));
        if (typeof json.visible === "boolean") {
            this.visible = json.visible;
        }
        this.shape = new Shape(json.shape);
        this.shape.createShape(json.shape);
        this.buttonMode = true;
        this.interactive = true;

        this.label = new Label(json.label);
        this.addChild(this.shape);
        this.addChild(this.label);

    }


    public registerEvent(key: string, callback: Function) {
        this.unRegister(key, callback);
        this.on(key, (event?: Event) => {
            callback && callback(event);
        });
    }

    public unRegister(key: string, callback: Function) {
        this.off(key, () => {
            callback && callback();
        });
    }

    getShape(): Shape {
        return this.shape;
    }


    protected shape: Shape;
    protected label: Label;

    protected id: string;
}