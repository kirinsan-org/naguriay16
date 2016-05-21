'use strict'

let canvas = document.getElementById('canvas');
let game = new Game(canvas);
let leapHandler = new LeapHandler(game);
let socketHandler = new SocketHandler(game, leapHandler);