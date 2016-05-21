'use strict'
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// 静的ファイルホスティング
app.use(express.static(__dirname + '/public'));

class Hand {
  constructor() {
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0, 1];
  }
}

class Player {
  constructor() {
    this.hp = 100;
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0, 1];
    this.leftHand = new Hand();
    this.rightHand = new Hand();
  }
}

let players = new Map();

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  let player = new Player();
  players.set(socket, player);

  /**
   * 対戦相手がいたらマッチング
   */
  let anotherSocket = getAnotherSocket();
  if (anotherSocket) {
    anotherSocket.emit('startBattle', { face: 'img/kao.png', hair: 'img/hair.png' });
    socket.emit('startBattle', { face: 'img/kao2.png', hair: 'img/hair.png' });
  }

  /**
   * 攻撃を受けた時
   */
  socket.on('attack', _ => {
    console.log('attack');

    let anotherSocket = getAnotherSocket();
    if (!anotherSocket) return;

    let anotherPlayer = players.get(anotherSocket);
    if (!anotherPlayer) return;

    console.log(anotherPlayer);

    // TODO ダメージを与えるかどうかの判定処理
    anotherPlayer.hp--;

    // 負けか、ダメージか
    if (anotherPlayer.hp <= 0) {
      anotherSocket.emit('lose');
    } else {
      anotherSocket.emit('attacked');
    }
  });

  /**
   * プレイヤー情報を受け取った時、相手に伝達する
   */
  socket.on('updatePlayer', data => {
    // console.log('updatePlayer', data);

    let player = players.get(socket);
    player.leftHand.position = data.leftHand.position;
    player.rightHand.position = data.rightHand.position;

    // 対戦相手に自分の情報を通知
    let anotherSocket = getAnotherSocket();
    if (!anotherSocket) return;

    anotherSocket.emit('updateEnemy', player);
  });

  /**
   * コネクション切断時にリソースを開放する
   */
  socket.on('disconnect', _ => {
    console.log('disconnected', socket.id);

    players.delete(socket);
  });

  function getAnotherSocket() {
    let id = getAnotherId();
    if (id) {
      return io.sockets.connected[id];
    }
    return null;
  }

  function getAnotherId() {
    let myId = socket.id;
    for (let id in io.sockets.connected) {
      if (id !== myId) return id;
    }
    return null;
  }
});

server.listen(4040);
