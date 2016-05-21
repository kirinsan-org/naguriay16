/// <reference path="../source/ts/d_ts/LeapMotionTS.d.ts" />
/// <reference path="../source/ts/d_ts/jquery.d.ts" />
declare var Leap: any;
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
