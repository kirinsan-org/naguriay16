'use strict'

let cubeGeometry = createCubeGeometry();
// 両手のデータ
let handGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
let handMaterial = new THREE.MeshPhongMaterial({ color: 0xB68373 });

/**
 * game.enemy.head
 */
class EnemyHead extends THREE.Object3D {
  constructor() {
    super();

    let loader = this.loader = new THREE.TextureLoader();

    // this.setFaceTextureFromUrl('kao.png');
    // this.setHairTextureFromUrl('hair.png');
  }

  /**
   * 顔の画像を設定する
   */
  setFaceTextureFromUrl(url) {
    this.loader.load(url, texture => {
      this.setFaceTexture(texture);
    });
  }

  setFaceTexture(texture) {
    if (this.face) {
      this.face.material.map = texture;
    } else {
      let material = new THREE.MeshBasicMaterial({ map: texture });
      let face = this.face = new THREE.Mesh(cubeGeometry, material);
      face.position.y = 0.5;
      this.add(face);
    }
  }

  /**
   * 髪の画像を設定する
   */
  setHairTextureFromUrl(url) {
    this.loader.load(url, texture => {
      this.setHairTexture(texture);
    });
  }

  setHairTexture(texture) {
    if (this.hair) {
      this.hair.material.map = texture;
    } else {
      let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      let hair = this.hair = new THREE.Mesh(cubeGeometry, material);
      hair.scale.y = 2.3;
      hair.scale.x = 1.1;
      hair.scale.z = 1.1;
      this.add(hair);
    }
  }
}

/**
 * game.enemy
 */
class Enemy extends THREE.Object3D {
  constructor() {
    super();

    let leftHand = this.leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.x = 2;
    leftHand.position.y = -0.8;
    this.add(leftHand);

    let rightHand = this.rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.x = -2;
    rightHand.position.y = -0.8;
    this.add(rightHand);

    this.head = new EnemyHead();
    this.add(this.head);
  }
}

/**
 * game.player
 */
class Player extends THREE.Object3D {
  constructor() {
    super();
    this.leftHand = new THREE.Mesh(handGeometry, handMaterial);
    this.leftHand.position.x = -2;
    this.add(this.leftHand);

    this.rightHand = new THREE.Mesh(handGeometry, handMaterial);
    this.rightHand.position.x = 2;
    this.add(this.rightHand);
  }
}

class Game extends BaseGame {

  /**
   * シーンの初期化
   */
  init() {

    this.enemy = new Enemy();
    this.enemy.visible = false; // 相手が見つかるまで非表示
    this.enemy.position.z = -3;
    this.scene.add(this.enemy);

    this.player = new Player();
    // this.player.position.z = -1;
    this.scene.add(this.player);

    let light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, 1, 1);
    this.scene.add(light);

  }

  /**
   * 毎フレームの処理
   */
  update() {
    // this.enemy.rotation.y += this.timer.getDelta();
  }

  setEnemyHead(faceUrl, hairUrl) {
    this.enemy.head.setFaceTextureFromUrl(faceUrl);
    this.enemy.head.setHairTextureFromUrl(hairUrl);
  }

  setLeftHandPosition(x, y, z) {
    this.leftHand.position.x = x;
    this.leftHand.position.y = y;
    this.leftHand.position.z = z;
  }

  setRightHandPosition(x, y, z) {
    this.rightHand.position.x = x;
    this.rightHand.position.y = y;
    this.rightHand.position.z = z;
  }
}
