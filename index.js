console.log("This is my game");
// resize canvas to be larger
const canvas = document.getElementById("game-container");
// giant object resposible for drawing out everything in the game
const c = canvas.getContext('2d')
canvas.width = 1024;
canvas.height = 576;
console.log(c);

// draw a rectangle
c.fillStyle = 'white';
c.fillRect(0,0, canvas.width, canvas.height);

// import map image
const image = new Image();
image.src = '/RPGGameMapAlyssaVille_noSprites.png'

// import player down image
const playerImage = new Image();
playerImage.src = "/playerDown.png"

class Sprite {
    constructor({position, image, velocity}) {
        this.position = position;
        this.image = image;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite({
    // set position to an object with x and y axis
    position: {
    x: -690,
    y: -380
    },
    image: image
})

// create an object for keys that are not pressed down by default
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
// animation infinite loop
function animate() {

    window.requestAnimationFrame(animate)
    
    // load map before player so that player is on top of map
    background.draw(image)
    c.drawImage(
        playerImage, 
        // cropping arguments (x, y, crop width, crop height)
        0, 
        0,
        playerImage.width/4,
        playerImage.height,
        // end of cropping arguments
        // place character in exact center of canvas
        canvas.width / 2 - playerImage.width / 4 / 2, 
        canvas.height / 2 - playerImage.height / 2,
        // last two arguments are width and height that image should be rendered out as
        playerImage.width/4,
        playerImage.height
    ) 

    if (keys.w.pressed && lastKey === 'w'){
        background.position.y += 3
    }
    else if (keys.a.pressed && lastKey === 'a') {
        background.position.x += 3
    }
    else if (keys.s.pressed && lastKey === 's') {
        background.position.y -= 3
    }
    else if (keys.d.pressed && lastKey === 'd') {
        background.position.x -= 3
    }
}
window.requestAnimationFrame(animate);


// listen for when player presses key and execute function
let lastKey = '';
window.addEventListener('keydown', (e) => {
    // console.log("keydown works", e.key)
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            console.log("pressed w key")
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            console.log("pressed a key")
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            console.log("pressed s key")
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            console.log("pressed d key")
            break
    }
    console.log(keys)
})

// create event listener for releasing keys
window.addEventListener('keyup', (e) => {
    // console.log("keydown works", e.key)
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
    console.log(keys)
})


