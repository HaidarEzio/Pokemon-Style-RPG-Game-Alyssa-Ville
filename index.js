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

// need to wait to load image before trying to draw image
// load map before player so that player is on top of map
image.onload = () => {
  c.drawImage(image, -690, -380);
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
    );  
}

// animation loop
function animate() {
    window.requestAnimationFrame(animate)
    console.log("animate")
}
// listen for when player presses key and execute function
window.addEventListener('keydown', (e) => {
    // console.log("keydown works", e.key)
    switch (e.key) {
        case 'w':
            console.log("pressed w key")
            break
        case 'a':
            console.log("pressed w key")
            break
        case 's':
            console.log("pressed w key")
            break
        case 'd':
            console.log("pressed w key")
            break
    }
})


