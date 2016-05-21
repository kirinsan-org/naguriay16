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
//# sourceMappingURL=main.js.map