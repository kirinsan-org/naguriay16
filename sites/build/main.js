'use strict'

let canvas = document.getElementById('mainstage');
let game = new Game(canvas);
let leapHandler = new LeapHandler(game);
let socketHandler = new SocketHandler(game, leapHandler);