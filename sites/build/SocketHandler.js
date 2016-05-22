'use strict'

const EMIT_INTERVAL = 1 / 20;

class SocketHandler {
  constructor(game, leap) {
    this.game = game;
    this.leapHandler = leapHandler;
    if (window.io) {
      // Socket.ioの接続を開始
      this.socket = io.connect();

      /**
       * 対戦相手が見つかった時
       * enemyData: {
       *   face: String,
       *   hair: String
       * }
       */
      this.socket.on('startBattle', enemyData => {
        this.game.setEnemyHead(enemyData.face, enemyData.hair);
      });

      /**
       * 敵の位置情報が送られてきた時
       * enemyData: {
       *   leftHand: {
       *     position:[x, y, z]
       *   },
       *   rightHand: {
       *     position:[x, y, z]
       *   }
       * }
       */
      this.socket.on('updateEnemy', enemyData => {
        // console.log('updateEnemy', enemyData);
        this.game.enemy.leftHand.position.x = -enemyData.leftHand.position[0];
        this.game.enemy.leftHand.position.y = -enemyData.leftHand.position[1];
        this.game.enemy.leftHand.position.z = -enemyData.leftHand.position[2];
        this.game.enemy.rightHand.position.x = -enemyData.rightHand.position[0];
        this.game.enemy.rightHand.position.y = -enemyData.rightHand.position[1];
        this.game.enemy.rightHand.position.z = -enemyData.rightHand.position[2];
      });

      // 攻撃された時
      this.socket.on('attacked', _ => {
        console.log('attacked');
      });

      this.socket.on('lose', _ => {
        alert('lose!');
      });

      this.socket.on('win', _ => {
        alert('win!');
      });

      // 自分の更新を送り続ける
      setInterval(_ => {
        this.updatePlayer();

        // パンチを送信する
        if (!this.attackSent && this.leapHandler.punching) {
          this.sendAttack();
          this.attackSent = true;
        } else if (this.attackSent && !this.leapHandler.punching) {
          // パンチ後一定期間経過したら attackSent を戻す
          this.attackSent = false;
        }

      }, EMIT_INTERVAL);
    }
  }

  /**
   * 攻撃したことを通知する
   */
  sendAttack() {
    if (window.io) {
      this.socket.emit('attack');
    }
  }

  updatePlayer() {
    if (window.io) {
      let player = this.game.player;
      let leftHand = {
        position: [player.leftHand.position.x, player.leftHand.position.y, player.leftHand.position.z]
      };
      let rightHand = {
        position: [player.rightHand.position.x, player.rightHand.position.y, player.rightHand.position.z]
      };

      let defencing = this.leapHandler.defencing;
      this.socket.emit('updatePlayer', { defencing, leftHand, rightHand });
    }
  }
}
