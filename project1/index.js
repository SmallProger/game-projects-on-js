const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let img = new Image();
img.src = "./assets/shadow_dog.png";

const spriteWidth = 575;
const spriteHeight = 523;
let gameFrame = 0;
let staggerFrames = 5;
let state = "fall";

const changerAnimation = document.querySelector("#animations");
changerAnimation.addEventListener("change", function (event) {
  state = event.target.value;
});

const animationSpeedValue = document.querySelector("#animationSpeedValue");
const changerSpeedAnimation = document.querySelector("#animationSpeed");
changerSpeedAnimation.addEventListener("change", function (event) {
  staggerFrames = event.target.value;
  animationSpeedValue.textContent = `Stagger Frames = ${event.target.value}`;
});
let animationStates = [
  {
    name: "idle",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 7,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dizz",
    frames: 11,
  },
  {
    name: "sit",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "bite",
    frames: 7,
  },
  {
    name: "ko",
    frames: 12,
  },
  {
    name: "getHit",
    frames: 4,
  },
];
let spriteAnimations = {};
animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };
  for (let i = 0; i < state.frames; i++) {
    frames.loc.push({
      x: i * spriteWidth,
      y: index * spriteHeight,
    });
  }
  spriteAnimations[state.name] = frames;
});
console.log(spriteAnimations);
//This lesson explain how program animation, not for moving and etc, that is why i dont add properties like speed

function animate() {
  ctx.clearRect(0, 0, canvas.height, canvas.width);

  let position =
    Math.floor(gameFrame / staggerFrames) % spriteAnimations[state].loc.length;

  let frameX = spriteWidth * position;
  let frameY = spriteAnimations[state].loc[position].y;
  ctx.drawImage(
    img,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );

  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
