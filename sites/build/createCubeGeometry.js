function createCubeGeometry() {

  var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  var uv = cubeGeometry.faceVertexUvs[0];

  // Right
  uv[0][0].x = 2 / 6;
  uv[0][1].x = 2 / 6;
  uv[0][2].x = 3 / 6;
  uv[1][0].x = 2 / 6;
  uv[1][1].x = 3 / 6;
  uv[1][2].x = 3 / 6;

  // Left
  uv[2][0].x = 0 / 6;
  uv[2][1].x = 0 / 6;
  uv[2][2].x = 1 / 6;
  uv[3][0].x = 0 / 6;
  uv[3][1].x = 1 / 6;
  uv[3][2].x = 1 / 6;

  // Top
  uv[4][0].x = 4 / 6;
  uv[4][1].x = 4 / 6;
  uv[4][2].x = 5 / 6;
  uv[5][0].x = 4 / 6;
  uv[5][1].x = 5 / 6;
  uv[5][2].x = 5 / 6;

  // Bottom
  uv[6][0].x = 5 / 6;
  uv[6][1].x = 5 / 6;
  uv[6][2].x = 6 / 6;
  uv[7][0].x = 5 / 6;
  uv[7][1].x = 6 / 6;
  uv[7][2].x = 6 / 6;

  // Front
  uv[8][0].x = 1 / 6;
  uv[8][1].x = 1 / 6;
  uv[8][2].x = 2 / 6;
  uv[9][0].x = 1 / 6;
  uv[9][1].x = 2 / 6;
  uv[9][2].x = 2 / 6;

  // Back
  uv[10][0].x = 3 / 6;
  uv[10][1].x = 3 / 6;
  uv[10][2].x = 4 / 6;
  uv[11][0].x = 3 / 6;
  uv[11][1].x = 4 / 6;
  uv[11][2].x = 4 / 6;

  cubeGeometry.uvsNeedUpdate = true;

  return cubeGeometry;
}