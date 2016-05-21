
/// <reference path="d_ts/LeapMotionTS.d.ts" />
/// <reference path="d_ts/jquery.d.ts" />

declare var Leap: any;
declare var clm: any;
declare var pModel: any;

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

class FaceRecognition {
  private _ctrack: any;
  private _points: any;
  public faceAngle:number = 0;
  private _$el: any = {};
  
  constructor () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    
    this._$el.video = document.getElementById('videoel');
    this._$el.faceMask = document.getElementById('face-mask');
    this._$el.canvasCrop = document.getElementById('overlay');
    this._$el.cropCtx = this._$el.canvasCrop.getContext('2d');
    
    this._ctrack = new clm.tracker();
    this._ctrack.init(pModel);
    this._ctrack.start(this._$el.video);
    
    this.startCamera();
    
    setInterval(()=>{
      this.recognition();
      this.cropFace();
    })
  }
  
  getRadian(x, y, x2, y2) { 
    return Math.atan2(x2 - x, y2 - y);
  }
  
  getDistance(x, y, x2, y2) {
    return Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
  }
  
  startCamera(){
    navigator.getUserMedia( {video: true},
      (e) => {
        this._$el.video.src = window.URL.createObjectURL(e);
        this._$el.video.play();
      },
      (err) => {
        alert('カメラ取得失敗');
        console.log(err);
      }
    ); 
  }

  recognition() {
    this._points = this._ctrack.getCurrentPosition();
    this.faceAngle = (this._points[41][0] - this._points[1][0])/(this._points[13][0] - this._points[1][0])-0.5);
  }
  
  cropFace(){
    if(!this._points || !this._points.length) return false;
    const pos = this._points;
    const ctx = this._$el.cropCtx;
    
    ctx.save();
    var tgtWidth = 200;
    //変形マトリックスに回転を適用
    var rad = this.getRadian(
        pos[33][0],
        pos[33][1],
        pos[62][0],
        pos[62][1]);
    
    ctx.translate(tgtWidth*0.5, tgtWidth*0.5)
    ctx.rotate(rad);
    ctx.translate(tgtWidth*-0.5, tgtWidth*-0.5)
    
    //読み込んだimgをcanvas(c1)に貼付け
    var width = this.getDistance(
        pos[19][0],
        pos[19][1],
        pos[15][0],
        pos[15][1]
      ) * 0.2;

    ctx.drawImage(this._$el.video,
      (pos[0][0] +pos[14][0]) * 0.5+width,
      (pos[0][1]+pos[14][1]) * 0.5-width*2,
      width*12,width*12,
      0,0,tgtWidth,tgtWidth); 
    //canvasの状態を元に戻す
    ctx.restore();
    // ctx.drawImage(this._$el.faceMask,0,0,tgtWidth,tgtWidth); 
    
  }
}