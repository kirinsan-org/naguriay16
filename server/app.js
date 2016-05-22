var express = require('express');
var app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
var path = require('path');
var https = require('https');
var fs = require('fs');
var privateKey = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cert', 'utf8');
var server = https.createServer({
    key: privateKey,
    cert: certificate
}, app);
var io = require('socket.io')(server);
server.listen(443);
// 静的ファイルホスティング
app.use(express.static(path.join(__dirname, '..', 'sites', 'build')));
var Hand = (function () {
    function Hand() {
        this.position = [0, 0, 0];
    }
    return Hand;
}());
var Player = (function () {
    function Player() {
        this.hp = 20;
        this.face = null; // 顔画像URL
        this.hair = 'img/hair.png'; // 髪画像URL
        this.ready = false; // 対戦準備ができたかどうか
        this.leftHand = new Hand();
        this.rightHand = new Hand();
        this.guard = false; // ガード中かどうか
    }
    return Player;
}());
var players = new WeakMap(); // <Socket, Player>
var battlePlayers = new Map(); // <Player, Player>
var playerSocketMap = new Map(); // <Player, Socket>
io.on('connection', function (socket) {
    console.log('connected', socket.id);
    var player = new Player();
    players.set(socket, player);
    playerSocketMap.set(player, socket);
    socket.on('setFace', function (face) {
        console.log('setFace', socket.id, face);
        player.face = face;
    });
    socket.on('ready', onReady);
    socket.on('attack', onAttack);
    socket.on('guard', onGuard);
    socket.on('updatePlayer', onUpdatePlayer);
    socket.on('headRotate', onHeadRotate);
    function onReady() {
        console.log('ready', socket.id);
        player.ready = true;
        // 他のready=trueかつbattlePlayers.get(player)===nullなPlayerがいればマッチング
        for (var socketId in io.sockets.connected) {
            if (socketId !== socket.id) {
                var anotherSocket = io.sockets.connected[socketId];
                var anotherPlayer = players.get(anotherSocket);
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
        var anotherPlayer = battlePlayers.get(player);
        if (!anotherPlayer)
            return;
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
    var intervalId;
    function startUpdateAnotherPlayer() {
        console.log('startUpdateAnotherPlayer');
        clearInterval(intervalId);
        var anotherPlayer = battlePlayers.get(player);
        intervalId = setInterval(function (_) {
            socket.emit('updateEnemy', {
                headRotation: anotherPlayer.headRotation,
                leftHand: anotherPlayer.leftHand,
                rightHand: anotherPlayer.rightHand
            });
        }, 100);
    }
    function stopUpdateAnotherPlayer() {
        clearInterval(intervalId);
    }
    function onHeadRotate(axis) {
        player.headRotation = axis;
    }
    /**
     * コネクション切断時にリソースを開放する
     */
    socket.on('disconnect', function (_) {
        console.log('disconnected', socket.id);
        // 対戦相手に切断を通知
        var anotherPlayer = battlePlayers.get(player);
        if (anotherPlayer) {
            var anotherSocket = playerSocketMap.get(anotherPlayer);
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
//# sourceMappingURL=app.js.map