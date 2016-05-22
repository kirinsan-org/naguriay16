/// <reference path="../source/ts/d_ts/LeapMotionTS.d.ts" />
/// <reference path="../source/ts/d_ts/jquery.d.ts" />
declare var Leap: any;
declare var clm: any;
declare var pModel: any;
interface Hand {
}
interface Hands {
    left?: Hand;
    right?: Hand;
}
declare class Motion {
    leap: any;
    hands: Hands;
    constructor();
    parse(hands: any): void;
}
declare class FaceRecognition {
    private _ctrack;
    private _points;
    faceAngle: number;
    private _$el;
    constructor();
    getRadian(x: any, y: any, x2: any, y2: any): number;
    getDistance(x: any, y: any, x2: any, y2: any): number;
    startCamera(): void;
    recognition(): void;
    cropFace(): boolean;
    getFaceTexture(): any;
}
