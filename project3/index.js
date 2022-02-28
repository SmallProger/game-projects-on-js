const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const canvasHeight = window.innerHeight - 20;
const canvasWidth = 600;

canvas.height = canvasHeight;
canvas.width = canvasWidth;
let amountNPC = 11;

let imagesNPC = [];

function loadImages() {
  for (let i = 0; i < 4; i++) {
    imagesNPC.push(new Image());
  }
  for (let i = 0; i < 4; i++) {
    imagesNPC[i].src = `./assets/enemy${i + 1}.png`;
  }
}
loadImages();

class NPC {
  constructor(img) {
    this.img = img;
    this.spriteWidth = 293;
    this.spriteHeight = 155;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.position = {
      x: Math.random() * (canvasWidth - this.width),
      y: Math.random() * (canvasHeight - this.height),
    };
    this.animationFrame = 0;
    this.speedAnimate = Math.floor(Math.random() * 3 + 1);
    this.speed = 0;
    this.frame = 0;
  }
  draw() {
    ctx.drawImage(
      this.img,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.position.x += this.speed;
    this.position.y += this.speed;
    this.speed = Math.random() * 4 - 2;
    if (this.animationFrame % this.speedAnimate == 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
    this.animationFrame++;
    this.draw();
  }
}
let arrNPC = [];

for (let i = 0; i < amountNPC; i++) {
  arrNPC.push(new NPC(imagesNPC[0]));
}

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  arrNPC.forEach((NPC) => {
    NPC.update();
  });

  window.requestAnimationFrame(animate);
}
animate();
