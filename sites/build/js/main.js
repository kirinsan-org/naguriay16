var Motion = (function () {
    function Motion() {
        var _this = this;
        this.hands = {};
        this.leap = Leap.loop({ enableGestures: true }, function (frame) {
            _this.parse(frame.hands);
        });
    }
    Motion.prototype.parse = function (hands) {
        var _this = this;
        hands.forEach(function (d) {
            var tmp = {
                axis: d.palmPosition
            };
            if (d.type === "right") {
                _this.hands.right = tmp;
            }
            else {
                _this.hands.left = tmp;
            }
            if (!!_this.hands.left) {
                $("#left").css({
                    "left": _this.hands.left.axis[0],
                    "top": _this.hands.left.axis[2]
                });
            }
            if (!!_this.hands.right) {
                $("#right").css({
                    "left": _this.hands.right.axis[0],
                    "top": _this.hands.right.axis[2]
                });
            }
            console.log(JSON.stringify(_this.hands));
        });
    };
    return Motion;
})();
var FaceRecognition = (function () {
    function FaceRecognition() {
        var _this = this;
        this.faceAngle = 0;
        this._$el = {};
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
        setInterval(function () {
            _this.recognition();
            _this.cropFace();
        });
    }
    FaceRecognition.prototype.getRadian = function (x, y, x2, y2) {
        return Math.atan2(x2 - x, y2 - y);
    };
    FaceRecognition.prototype.getDistance = function (x, y, x2, y2) {
        return Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
    };
    FaceRecognition.prototype.startCamera = function () {
        var _this = this;
        navigator.getUserMedia({ video: true }, function (e) {
            _this._$el.video.src = window.URL.createObjectURL(e);
            _this._$el.video.play();
        }, function (err) {
            alert('カメラ取得失敗');
            console.log(err);
        });
    };
    FaceRecognition.prototype.recognition = function () {
        this._points = this._ctrack.getCurrentPosition();
        this.faceAngle = (this._points[41][0] - this._points[1][0]) / (this._points[13][0] - this._points[1][0]) - 0.5;
        ;
    };
    FaceRecognition.prototype.cropFace = function () {
        if (!this._points || !this._points.length)
            return false;
        var pos = this._points;
        var ctx = this._$el.cropCtx;
        ctx.save();
        var tgtWidth = 200;
        var rad = this.getRadian(pos[33][0], pos[33][1], pos[62][0], pos[62][1]);
        ctx.translate(tgtWidth * 0.5, tgtWidth * 0.5);
        ctx.rotate(rad);
        ctx.translate(tgtWidth * -0.5, tgtWidth * -0.5);
        var width = this.getDistance(pos[19][0], pos[19][1], pos[15][0], pos[15][1]) * 0.2;
        ctx.drawImage(this._$el.video, (pos[0][0] + pos[14][0]) * 0.5 + width, (pos[0][1] + pos[14][1]) * 0.5 - width * 2, width * 12, width * 12, 0, 0, tgtWidth, tgtWidth);
        ctx.restore();
    };
    return FaceRecognition;
})();
//# sourceMappingURL=main.js.map