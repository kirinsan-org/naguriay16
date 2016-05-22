'use strict'

let canvas = document.getElementById('canvas');
let game = new Game(canvas);
let socketHandler = new SocketHandler(game);
let leapHandler = new LeapHandler(game, socketHandler);