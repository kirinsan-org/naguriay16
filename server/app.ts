const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
declare const WeakMap: any;
declare const Map: any;

// 静的ファイルホスティング
app.use(express.static(__dirname + '/public'));

class Hand {
  position: Number[]
  constructor() {
    this.position = [0, 0, 0];
  }
}

class Player {
  hp: Number;
  face: String;
  hair: String;
  ready: Boolean;
  leftHand: Hand;
  rightHand: Hand;
  guard: Boolean;

  constructor() {
    this.hp = 20;
    this.face = null;           // 顔画像URL
    this.hair = 'img/hair.png'; // 髪画像URL
    this.ready = false;         // 対戦準備ができたかどうか
    this.leftHand = new Hand();
    this.rightHand = new Hand();
    this.guard = false;          // ガード中かどうか
  }
}

let players = new WeakMap(); // <Socket, Player>
let battlePlayers = new Map(); // <Player, Player>
let playerSocketMap = new Map(); // <Player, Socket>

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  let player = new Player();
  players.set(socket, player);
  playerSocketMap.set(player, socket);

  socket.on('setFace', face => {
    console.log('setFace', socket.id, face);
    player.face = face
  });
  
  socket.on('ready', onReady);
  socket.on('attack', onAttack);
  socket.on('guard', onGuard);
  socket.on('updatePlayer', onUpdatePlayer);

  function onReady() {
    console.log('ready', socket.id);
    player.ready = true;

    // 他のready=trueかつbattlePlayers.get(player)===nullなPlayerがいればマッチング
    for (let socketId in io.sockets.connected) {
      if (socketId !== socket.id) {
        let anotherSocket = io.sockets.connected[socketId];
        let anotherPlayer = players.get(anotherSocket);

        if (anotherPlayer.ready && !battlePlayers.get(player)) {
          console.log('matched!', player, anotherPlayer);

          // マッチング
          battlePlayers.set(player, anotherPlayer);
          battlePlayers.set(anotherPlayer, player);

          // ゲーム開始
          socket.emit('startBattle', anotherPlayer);
          anotherSocket.emit('startBattle', player);

          startUpdateAnotherPlayer();
        }
      }
    }
  }

  function onAttack(callback) {
    console.log('attack');

    let anotherPlayer = battlePlayers.get(player);
    if (!anotherPlayer) return;

    // 相手が防御していたら失敗
    if (anotherPlayer.guard) {
      console.log('blocked');
      callback({ success: false });
      return;
    }

    // そうでなければ相手にダメージ
    anotherPlayer.hp--;
    console.log('damage', anotherPlayer);
    callback({ success: true });

    // - 相手のHPが0なら試合終了
    if (anotherPlayer.hp === 0) {
      socket.emit('endBattle', { win: true });
      anotherPlayer.socket.emit('endBattle', { win: false });
    }
  }

  function onGuard(guardState) {
    player.guard = guardState;
  }

  function onUpdatePlayer(data) {
    // console.log('updatePlayer', data);

    // 手の位置を更新
    player.leftHand.position = data.leftHand.position;
    player.rightHand.position = data.rightHand.position;
  }

  let intervalId;

  function startUpdateAnotherPlayer() {
    console.log('startUpdateAnotherPlayer');
    clearInterval(intervalId);

    let anotherPlayer = battlePlayers.get(player);

    intervalId = setInterval(_ => {
      socket.emit('updateEnemy', anotherPlayer);
    }, 100);
  }

  function stopUpdateAnotherPlayer() {
    clearInterval(intervalId);
  }

  /**
   * コネクション切断時にリソースを開放する
   */
  socket.on('disconnect', _ => {
    console.log('disconnected', socket.id);

    // 対戦相手に切断を通知
    let anotherPlayer = battlePlayers.get(player);
    if (anotherPlayer) {
      let anotherSocket = playerSocketMap.get(anotherPlayer);
      anotherSocket.emit('remoteError');
      battlePlayers.delete(anotherPlayer);
    }

    battlePlayers.delete(player);
    players.delete(socket);
    playerSocketMap.delete(player);
    player = null;
  });
});

server.listen(4040);
