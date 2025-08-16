// CANVAS
const canvas = document.getElementById("game-container");
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// Simple placeholder so you see something even before images draw
c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

// STATE
const offset = { x: -690, y: -380 };
const battle = { initiated: false };

// --------------------------
// UTILS
// --------------------------
function collisionDetect({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y <= rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height >= rect2.position.y
  );
}

function activateBattle() {
  gsap.to('#battle-activate', {
    opacity: 1,
    repeat: 3,
    duration: 0.4,
    yoyo: true,
    onComplete() {
      gsap.to('#battle-activate', {
        opacity: 1,
        duration: 0.4,
        onComplete() {
          animateBattle();
          gsap.to('#battle-activate', { opacity: 0, duration: 0.4 });
        }
      });
    }
  });
}

function animateBattle() {
  battleBackground.draw();
  draggle.draw();
  emby.draw();
  gsap.to('#interface', { opacity: 1, duration: 0.4 });
  window.requestAnimationFrame(animateBattle);
  // console.log("battle in progress");
}

// --------------------------
// MAP ARRAYS
// --------------------------
const MAP_WIDTH = 62;

// collisions → boundaries
const collisionsMap = [];
for (let i = 0; i < (Array.isArray(collisions) ? collisions.length : 0); i += MAP_WIDTH) {
  collisionsMap.push(collisions.slice(i, i + MAP_WIDTH));
}

const boundaries = [];
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, n) => {
    if (symbol === 1089) {
      boundaries.push(
        new Boundary({
          position: {
            x: n * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      );
    }
  });
});

// battle zones
const battleZonesMap = [];
for (let i = 0; i < (Array.isArray(battleZonesData) ? battleZonesData.length : 0); i += MAP_WIDTH) {
  battleZonesMap.push(battleZonesData.slice(i, i + MAP_WIDTH));
}

const battleZones = [];
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, n) => {
    if (symbol === 1089) {
      battleZones.push(
        new Boundary({
          position: {
            x: n * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      );
    }
  });
});

// FIX: use mapBordersData (NOT mapBordersMap!) to build the grid

const mapBordersData = [];
const mapBordersMap = [];
for (let i = 0; i < (Array.isArray(mapBordersData) ? mapBordersData.length : 0); i += MAP_WIDTH) {
  mapBordersMap.push(mapBordersData.slice(i, i + MAP_WIDTH));
}

const mapBorders = [];
mapBordersMap.forEach((row, i) => {
  row.forEach((symbol, n) => {
    if (symbol === 1089) {
      mapBorders.push(
        new Boundary({
          position: {
            x: n * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      );
    }
  });
});

// --------------------------
// IMAGES (preload, then start)
// --------------------------
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load ' + src));
    img.src = src;
  });
}

let background, forestBackground, foreground, battleBackground, player, draggle, emby;

async function boot() {
  // Load images (EDIT paths as needed)
  const [
    mapImage,
    foregroundImage,
    playerDownImage,
    playerUpImage,
    playerRightImage,
    playerLeftImage,
    battleBackgroundImage,
    draggleImage,
    embyImage,
    // FIX: forest map should be an Image too (if it's an image file)
    forestMapImage
  ] = await Promise.all([
    loadImage('img/RPGGameMapAlyssaVille_noSprites.png'),
    loadImage('img/Foreground Objects.png'),
    loadImage('img/playerDown.png'),
    loadImage('img/playerUp.png'),
    loadImage('img/playerRight.png'),
    loadImage('img/playerLeft.png'),
    loadImage('img/battleBackground.png'),
    loadImage('img/draggleImage.png'),
    loadImage('img/embyImage.png'),
    loadImage('img/forestMap.png') // <<< rename to your actual forest map image
  ]);

  // SPRITES
  player = new Sprite({
    position: {
      x: canvas.width / 2 - 192 / 4 / 2,
      y: canvas.height / 2 + 20 / 2
    },
    image: playerDownImage,
    frames: { max: 4, hold: 10 },
    sprites: {
      up: playerUpImage,
      down: playerDownImage,
      right: playerRightImage,
      left: playerLeftImage
    }
  });

  background = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: mapImage
  });

  // FIX: use the loaded forest image, not an undefined forestMap
  forestBackground = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: forestMapImage
  });

  foreground = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: foregroundImage
  });

  battleBackground = new Sprite({
    position: { x: 0, y: 0 },
    image: battleBackgroundImage
  });

  draggle = new Sprite({
    position: { x: 800, y: 100 },
    image: draggleImage,
    frames: { max: 4, hold: 30 },
    walk: true
  });

  emby = new Sprite({
    position: { x: 300, y: 325 },
    image: embyImage,
    frames: { max: 4, hold: 30 },
    walk: true
  });

  // MOVEABLES (put forestBackground only if you want it in this scene)
  moveables = [background, ...boundaries, foreground, ...battleZones /*, forestBackground*/];

  // Start!
  window.requestAnimationFrame(animate);
}

// --------------------------
// CONTROLS
// --------------------------
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false }
};
let lastKey = '';

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w': keys.w.pressed = true; lastKey = 'w'; break;
    case 'a': keys.a.pressed = true; lastKey = 'a'; break;
    case 's': keys.s.pressed = true; lastKey = 's'; break;
    case 'd': keys.d.pressed = true; lastKey = 'd'; break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w': keys.w.pressed = false; break;
    case 'a': keys.a.pressed = false; break;
    case 's': keys.s.pressed = false; break;
    case 'd': keys.d.pressed = false; break;
  }
});

// --------------------------
// MAIN ANIMATION
// --------------------------
let moveables = []; // re-assigned in boot()

function animate() {
  const frameId = window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
    if (collisionDetect({ rect1: player, rect2: boundary })) {
      // console.log("colliding");
    }
  });

  battleZones.forEach((bz) => bz.draw());
  mapBorders.forEach((mb) => mb.draw());

  player.draw();
  foreground.draw();

  let moving = true;
  player.walk = false;

  if (battle.initiated) return;

  // battle trigger
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        collisionDetect({ rect1: player, rect2: battleZone }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.05
      ) {
        battle.initiated = true;
        activateBattle();
        window.cancelAnimationFrame(frameId);
        break;
      }
    }
  }

  // map change trigger (left your logic intact, just cleaned a bit)
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < mapBorders.length; i++) {
      const mapBorder = mapBorders[i];
      const overlappingArea =
        (Math.min(player.position.x + player.width, mapBorder.position.x + mapBorder.width) -
          Math.max(player.position.x, mapBorder.position.x)) *
        (Math.min(player.position.y + player.height, mapBorder.position.y + mapBorder.height) -
          Math.max(player.position.y, mapBorder.position.y));

      if (
        collisionDetect({ rect1: player, rect2: mapBorder }) &&
        overlappingArea > (player.width * player.height) / 2
      ) {
        console.log('map border reached, moving to new area...');
        if (window.mapChange && typeof activateNewArea === 'function') {
          mapChange.initiated = true;
          activateNewArea();
        }
        window.cancelAnimationFrame(frameId);
        break;
      }
    }
  }

  // movement
  if (keys.w.pressed && lastKey === 'w') {
    player.walk = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionDetect({
        rect1: player,
        rect2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y + 3 } }
      })) { moving = false; break; }
    }
    if (moving) moveables.forEach((m) => (m.position.y += 3));
  } else if (keys.a.pressed && lastKey === 'a') {
    player.walk = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionDetect({
        rect1: player,
        rect2: { ...boundary, position: { x: boundary.position.x + 3, y: boundary.position.y } }
      })) { moving = false; break; }
    }
    if (moving) moveables.forEach((m) => (m.position.x += 3));
  } else if (keys.s.pressed && lastKey === 's') {
    player.walk = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionDetect({
        rect1: player,
        rect2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y - 3 } }
      })) { moving = false; break; }
    }
    if (moving) moveables.forEach((m) => (m.position.y -= 3));
  } else if (keys.d.pressed && lastKey === 'd') {
    player.walk = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionDetect({
        rect1: player,
        rect2: { ...boundary, position: { x: boundary.position.x - 3, y: boundary.position.y } }
      })) { moving = false; break; }
    }
    if (moving) moveables.forEach((m) => (m.position.x -= 3));
  }
}

// kick off after assets are ready
boot().catch(err => console.error('Boot failed:', err));
