const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = 500;
const canvasHeight = 500;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let explosions = [];

class Explosion {
  constructor(x, y) {
    this.spriteHeight = 179;
    this.spriteWidth = 200;
    this.height = this.spriteHeight * 0.75;
    this.width = this.spriteWidth * 0.75;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "./assets/boom.png";
    this.frame = 0;
    this.counter = 0;
    this.angle = Math.random() * 6.2;
    this.audio = new Audio();
    this.audio.src = "./assets/ice_attack_2.wav";
  }
  draw() {
    this.audio.play();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width / 2,
      0 - this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
  update() {
    this.counter++;
    if (this.counter % 10 === 0) {
      this.frame++;
    }
  }
}
document.addEventListener("click", function (event) {
  let positionX = event.x - canvas.getBoundingClientRect().left;
  let positionY = event.y - canvas.getBoundingClientRect().top;
  explosions.push(new Explosion(positionX, positionY));
  console.log(explosions);
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  explosions.forEach((elem, index) => {
    elem.update();
    elem.draw();
    if (elem.frame == 5) {
      explosions.splice(index, 1);
      index--;
    }
  });
  requestAnimationFrame(animate);
}
animate();
