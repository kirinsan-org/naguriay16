'use strict'

class BaseGame {

  constructor(canvas) {

    // Three.js シーンを作成
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    this.loader = new THREE.TextureLoader();
    this.timer = new THREE.Clock();

    // シーンを初期化
    this.init();

    // ウィンドウリサイズ処理
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));

    // レンダーループを実行
    this.loop = this.renderLoop.bind(this);
    this.loop();
  }

  init() {
  }

  /**
   * Default update handler
   */
  update() {
  }

  /**
   * Render loop
   */
  renderLoop() {
    this.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop); // renderLoopではなくthisを正しくハンドルするloopを呼ぶ
  }


  /** 
    * Resize handler
    */
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * 便利関数集
   */

  /**
   * 画像読み込み
   */
  loadImage(url) {
    let loader = this.loader;
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, reject);
    });
  }

  getUserMedia(query) {
    return new Promise((resolve, reject) => {
      navigator.webkitGetUserMedia(query, resolve, reject);
    });
  }
}
