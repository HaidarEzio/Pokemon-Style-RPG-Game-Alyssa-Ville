// sprite creation
class Sprite {
    constructor({ position, image, velocity, frames = {max: 1}, sprites }) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.walk = false
        this.sprites = sprites
    }

    draw() {
        // c.drawImage(this.image, this.position.x, this.position.y)
        c.drawImage(
            this.image, 
            // cropping arguments (x, y, crop width, crop height)
            // multiplying val 0-3 by 48px to crop to correct character frame
            this.frames.val * this.width, 
            0,
            this.image.width / this.frames.max,
            this.image.height,
            // end of cropping arguments
            this.position.x,
            this.position.y,
            // last two arguments are width and height that image should be rendered out as
            this.image.width / this.frames.max,
            this.image.height
        ) 
            // if false will not run animation code
            if (!this.walk) return

            if(this.frames.max > 1) {
                this.frames.elapsed++
            }
            if(this.frames.elapsed % 10 === 0){
                if(this.frames.val < this.frames.max - 1) {
                    this.frames.val++
                }
                else this.frames.val = 0
            }
    }
}

// boundary creation
class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
     draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'
        // four arguments for x, y, width, and height
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
     }
}