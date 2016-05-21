'use strict'

const VELOCITY_PUNCH = -1000;

class LeapHandler {
  constructor(game) {
    this.game = game;
    Leap.loop(this.loop.bind(this));
  }

  /**
   * Leapセンサーのフレーム毎に呼ばれる
   */
  loop(frame) {
    for (let i = 0; i < frame.hands.length; i++) {
      let hand = frame.hands[i];
      this.processHand(hand);
    }
  }

  /**
   * それぞれの手を処理する
   */
  processHand(hand) {

    // パンチ判定
    if (!this.punching && hand.palmVelocity[2] < VELOCITY_PUNCH) {
      console.log('attack');
      this.punching = true;
      setTimeout(_ => {
        this.punching = false;
      }, 500);
    }

    // 自分の手の位置を更新する
    switch (hand.type) {
      case 'left': {
        this.game.player.leftHand.position.x = hand.palmPosition[0] * 0.01;
        this.game.player.leftHand.position.z = Math.min(0, Math.max(-2.5, hand.palmPosition[2] * 0.02));
        break;
      }

      case 'right': {
        this.game.player.rightHand.position.x = hand.palmPosition[0] * 0.01;
        this.game.player.rightHand.position.z = Math.min(0, Math.max(-2.5, hand.palmPosition[2] * 0.02));
        break;
      }
    }
  }
}