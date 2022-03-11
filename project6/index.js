const canvas = document.getElementById("movement");
const ctx = canvas.getContext("2d");
const shooter = document.getElementById("shooter");
const shooterCtx = shooter.getContext("2d");

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
shooter.width = canvasWidth;
shooter.height = canvasHeight;
ctx.font = "50px Impact";

let lastTime = 0;
let apperingInterval = 1500;
let timeLeft = 0;
let ravens = [];
let explosions = [];
let score = 0;
let gameOver = false;
class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteWidth * this.sizeModifier;
    this.position = {
      x: canvasWidth - this.width,
      y: Math.random() * (canvasHeight - this.width),
    };
    this.velocity = {
      x: Math.random() * 5 + 3,
      y: Math.random() * 5 - 2.5,
    };
    this.image = new Image();
    this.image.src = "./assets/raven.png";
    this.frame = 0;
    this.maxframe = 4;
    this.markedForDelete = false;
    this.flapSpeed = Math.random() * 50 + 50;
    this.timeSinceFlap = 0;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
  }
  draw() {
    shooterCtx.fillStyle = `rgb(${this.randomColors[0]}, ${this.randomColors[1]}, ${this.randomColors[2]}`;
    shooterCtx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
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
  update(deltaTime) {
    if (this.position.y + this.height > canvasHeight || this.position.y < 0) {
      this.velocity.y *= -1;
    }
    this.position.x -= this.velocity.x;
    this.position.y += this.velocity.y;
    this.flapInterval += deltaTime;
    if (this.timeSinceFlap > this.flapSpeed) {
      if (this.frame < this.maxframe) {
        this.frame++;
      } else {
        this.frame = 0;
      }
      this.timeSinceFlap = 0;
    } else {
      this.timeSinceFlap += deltaTime;
    }
    if (this.position.x + this.width < 0) gameOver = true;
  }
}
class Explosion {
  constructor(x, y, size) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.position = {
      x,
      y,
    };
    this.frame = 0;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
    this.image = new Image();
    this.image.src = "./assets/boom.png";
    this.markedForDelete = false;
    this.audio = new Audio();
    this.audio.src = "./assets/boom.wav";
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
    this.audio.play();
  }
  update(deltaTime) {
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
    } else {
      this.timeSinceLastFrame += deltaTime;
    }
    if (this.frame > 5) {
      this.markedForDelete = true;
    }
  }
}
function drawFail() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillText(
    `You lose, final score: ${score}`,
    canvasWidth / 2 - 200,
    canvasHeight / 2
  );
}
function animate(timeStamp) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  shooterCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  timeLeft += deltaTime;
  if (timeLeft > apperingInterval) {
    ravens.push(new Raven());
    timeLeft = 0;
  }
  //handle ravens nesting
  [...ravens].sort((a, b) => a.width - b.width);
  //draw objects
  [...ravens, ...explosions].forEach((object) => {
    object.draw();
    object.update(deltaTime);
  });
  //handle objects deletion
  explosions = explosions.filter((object) => !object.markedForDelete);
  ravens = ravens.filter((object) => !object.markedForDelete);
  //change score
  ctx.fillText(`Your Score: ${score}`, 100, 100);
  //handle ending game
  if (!gameOver) {
    requestAnimationFrame(animate);
  } else {
    drawFail();
  }
}
animate(0);

function matchColors(arr1, arr2) {
  return arr1[0] === arr2[0] && arr1[1] === arr2[1] && arr1[2] === arr2[2];
}

document.addEventListener("click", function (event) {
  let detectedPixelColors = shooterCtx.getImageData(event.x, event.y, 1, 1);
  [...ravens].forEach((elem, index) => {
    if (matchColors(elem.randomColors, detectedPixelColors.data)) {
      explosions.push(
        new Explosion(
          event.x - elem.width / 2,
          event.y - elem.width / 2,
          elem.width
        )
      );
      score++;
      elem.markedForDelete = true;
    }
  });
});
