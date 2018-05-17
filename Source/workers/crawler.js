/* eslint-disable */
const request = require('superagent').agent();

const hosts = ['planet', 'mapbox', 'temperature'];

function call(j, z, x, y) {
  const maxZ = 15;
  const maxX = 135 * (1 * (z - 7));
  const maxY = 87 * (1 * (z - 7));
  const host = hosts[j];
  const url = `http://localhost:3000/api/${host}/${z}/${x}/${y}`;

  if (x >= maxX && y >= maxY && z < maxZ) {
    z += 1;
    x = 128 * (1 * (z - 7));
    y = 81 * (1 * (z - 7));

    call(j, z, x, y);
    return;
  }

  if (y >= maxY) {
    x += 1;
    y = 81 * (1 * (z - 7));
  }

  y += 1;
  if (x <= maxX && y <= maxY) {
    request
      .get(url)
      .end((err, res) => {
        console.log(`Done ${url}`);
        call(j, z, x, y);
      });
  }
}

function startCalls() {
  for (let i = 0; i < hosts.length; i += 1) {
    request
      .post('http://localhost:3000/login')
      .send({
        email: 'user',
        password: 'user',
      })
      .end((err, res) => {
        call(i, 8, 128, 81);
      });
  }
}

startCalls();
