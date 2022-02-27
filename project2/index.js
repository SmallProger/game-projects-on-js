const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = 800;
const canvasHeight = 700;
const speedValue = document.querySelector(".speed");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let gameSpeed = 15;

class Layer {
  constructor(image, speedModifier) {
    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.speedModifier = speedModifier;
    this.speed = gameSpeed * this.speedModifier;
    this.x = 0;
    this.x2 = this.width;
  }
  draw() {
    ctx.drawImage(this.image, this.x, 0);
    ctx.drawImage(this.image, this.x2, 0);
  }
  update(gameSpeed) {
    this.speed = gameSpeed * this.speedModifier;
    if (this.x < -this.width) {
      this.x = this.width - this.speed + this.x2;
    } else {
      this.x -= this.speed;
    }
    if (this.x2 < -this.width) {
      this.x2 = this.width - this.speed + this.x;
    } else {
      this.x2 -= this.speed;
    }
    this.draw();
  }
}
let images = [new Image(), new Image(), new Image(), new Image(), new Image()];
images.forEach((elem, index) => {
  elem.src = `./assets/layer-${index + 1}.png`;
});
let layers = images.map((img, index) => new Layer(img, index * 0.3));

document.addEventListener("keydown", function (event) {
  if (event.key == "ArrowUp") {
    if (gameSpeed < 25) {
      gameSpeed++;
    }
    speedValue.textContent = gameSpeed;
  } else if (event.key == "ArrowDown") {
    if (gameSpeed > 1) {
      gameSpeed--;
    }
    speedValue.textContent = gameSpeed;
  }
});

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  layers.forEach((elem) => elem.update(gameSpeed));
  requestAnimationFrame(animate);
}
animate();
