
/// <reference path="d_ts/LeapMotionTS.d.ts" />
/// <reference path="d_ts/jquery.d.ts" />

declare var Leap: any;

interface Hand {
}

interface Hands {
  left?: Hand;
  right?: Hand;
}

class Motion {
  public leap: any;
  public hands: Hands = {};
  
  constructor () {
    this.leap = Leap.loop({enableGestures:true}, (frame) => {
      //var currentFrame = frame;
      // var previousFrame = controller.frame(1);
      // var tenFramesBack = controller.frame(10);

      this.parse(frame.hands);
    });
  }
  
  parse(hands: any){
    
    hands.forEach((d) => {
      
      let tmp = {
        axis:d.palmPosition
      };
      if(d.type === "right"){
        this.hands.right = tmp;
      } else {
        this.hands.left = tmp; 
      }
      
      if(!!this.hands.left){
        $("#left").css({
          "left":this.hands.left.axis[0],
          "top":this.hands.left.axis[2],
        })  
      }
      
      if(!!this.hands.right){
        $("#right").css({
          "left":this.hands.right.axis[0],
          "top":this.hands.right.axis[2],
        })  
      }
      console.log(JSON.stringify(this.hands));
    });
  }
  
}