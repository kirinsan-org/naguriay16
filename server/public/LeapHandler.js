'use strict'

const VELOCITY_PUNCH = -1000;
const DEFENCE_X_DISTANCE = 1.5;

/**
 * punching: Boolean
 * guard: Boolean
 */
class LeapHandler {
  constructor(game, socketHandler) {
    this.game = game;
    this.socketHandler = socketHandler;
    this.guard = false;
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

    // 防御判定
    if (frame.hands.length === 2
      && Math.abs(this.game.player.leftHand.position.x - this.game.player.rightHand.position.x) < DEFENCE_X_DISTANCE) {
      this.guard = true;
    } else {
      this.guard = false;
    }
  }

  /**
   * それぞれの手を処理する
   */
  processHand(hand) {

    // パンチ状態でない、ガード状態でないならパンチ判定
    if (!this.punching && !this.guard && hand.palmVelocity[2] < VELOCITY_PUNCH) {
      console.log('attack');
      this.socketHandler.sendAttack();

      // 攻撃してから一定時間は再攻撃しない
      this.punching = true;
      setTimeout(_ => {
        this.punching = false;
      }, 500);
    }

    // 自分の手の位置を更新する
    let playerHand = hand.type === 'left'
      ? this.game.player.leftHand
      : this.game.player.rightHand;

    playerHand.position.x = hand.palmPosition[0] * 0.01;

    // 防御中はパンチできない
    if (this.guard) {
      playerHand.position.z = -1;
    } else {
      playerHand.position.z = Math.min(0, Math.max(-2.5, hand.palmPosition[2] * 0.02));
    }
  }
}