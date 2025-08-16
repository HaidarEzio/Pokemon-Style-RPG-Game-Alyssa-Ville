// sprite creation
class Sprite {
  constructor({ position, image, velocity, frames = { max: 1, hold: 10 }, sprites, walk = false }) {
    this.position = position;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.walk = walk;
    this.sprites = sprites;

    // Allow either an Image object OR a src string
    if (typeof image === 'string') {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
        this._loaded = true;
      };
      img.onerror = () => console.error('Failed to load sprite image:', image);
      img.src = image;
      this._loaded = false;
    } else {
      this.image = image;
      if (this.image && this.image.complete) {
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
        this._loaded = true;
      } else {
        this._loaded = false;
        this.image.onload = () => {
          this.width = this.image.width / this.frames.max;
          this.height = this.image.height;
          this._loaded = true;
        };
      }
    }
  }

  draw() {
    // Guard until the image finished loading & dimensions are set
    if (!this._loaded || !this.image || !this.width || !this.height) return;

    // Crop + draw current frame
    c.drawImage(
      this.image,
      this.frames.val * this.width, // sx
      0,                            // sy
      this.image.width / this.frames.max, // sWidth
      this.image.height,                  // sHeight
      this.position.x,                    // dx
      this.position.y,                    // dy
      this.image.width / this.frames.max, // dWidth
      this.image.height                   // dHeight
    );

    if (!this.walk) return;

    if (this.frames.max > 1) this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold === 0) {
      this.frames.val = (this.frames.val + 1) % this.frames.max;
    }
  }
}

// boundary creation (unchanged)
class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
