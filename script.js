const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
let bullets = [];
let meteors = [];
let animationId;
let score = 0;
const scoreBoard = document.querySelector("#score");
const bigScore = document.querySelector(".big-score");
const scoreLabel = document.querySelector(".point-label");
const startButton = document.querySelector(".start-button");
const menuContainer = document.querySelector(".menu-container");

class Player {
  //Player which is a circle needs x, y, radius and colour
  constructor(x, y, radius, colour) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
  }
  draw() {
    //Need to draw the circle on the canvas
    c.beginPath();
    //Arc needs x, y, radius, start angle, end angle, counterclockwise
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.colour;
    //This is to fill the circle drawn
    c.fill();
  }
}

class Bullet {
  //Player which is a circle needs x, y, radius and colour
  constructor(x, y, radius, colour, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.velocity = velocity;
  }
  draw() {
    //Need to draw the circle on the canvas
    c.beginPath();
    //Arc needs x, y, radius, start angle, end angle, counterclockwise
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.colour;
    //This is to fill the circle drawn
    c.fill();
  }
  // update is to update the new values as the frame goes
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Meteor {
  //Player which is a circle needs x, y, radius and colour
  constructor(x, y, radius, colour, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.velocity = velocity;
  }
  draw() {
    //Need to draw the circle on the canvas
    c.beginPath();
    //Arc needs x, y, radius, start angle, end angle, counterclockwise
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.colour;
    //This is to fill the circle drawn
    c.fill();
  }
  // update is to update the new values as the frame goes
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//This is to change the canvas size according to container
function handleCanvasSize() {
  const container = document.getElementById("container");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight - 152;
  const x = canvas.clientWidth / 2;
  const y = canvas.clientHeight - 10; //10 cause its the size of the player
  const player = new Player(x, y, 10, "#black");
  player.draw();
}

//Call the function out so that at the very start it will be the right size
handleCanvasSize();

function resetGame() {
  bullets = [];
  meteors = [];
  menuContainer.style.display = "none";
  score = 0;
  scoreBoard.innerHTML = score;
  bigScore.innerHTML = score;
}

function spawnMeteors() {
  setInterval(() => {
    const radius = Math.random() * (50 - 20) + 20; //50 is the biggest 20 is the smallest
    const x = Math.random() * canvas.clientWidth; //gets any number within the width
    const y = 0 - radius; //starts from outside of canvas
    const colour = "red";
    const angle = Math.atan2(
      canvas.clientHeight - 10 - y,
      canvas.clientWidth / 2 - x
    ); //gets the angle of the triangle
    const velocity = {
      x: 0,
      y: Math.sin(angle) / 2,
    };
    //Every 2 sec will create a random meteor
    meteors.push(new Meteor(x, y, radius, colour, velocity));
  }, 2000);
}

function animate() {
  animationId = requestAnimationFrame(animate); //repeats itself also it will get the frame ID of the animation
  // c.clearRect(0, 0, canvas.clientWidth, canvas.height); //Every time the loop runs it will clear the drawing hence will look like a bullet moving only
  // player.draw();
  handleCanvasSize(); //keeps adjusting the canvas and replace itself while still drawing my player
  bullets.forEach((bullet, bulletIndex) => {
    bullet.update(); //keeps updating the x and y value of bullet
    if (
      bullet.x + bullet.radius < 0 ||
      bullet.x - bullet.radius > canvas.clientWidth ||
      bullet.y + bullet.radius < 0
    ) {
      bullets.splice(bulletIndex, 1);
    } // if statement is to check if bullets go out of screen will it still be "appearing". If yes then splice them out.
  });
  meteors.forEach((meteor, meteorIndex) => {
    meteor.update(); //keeps updating the x and y value of bullet
    if (meteor.y + meteor.radius > canvas.clientHeight) {
      cancelAnimationFrame(animationId); //this will stop all the animation via the frame ID
      menuContainer.style.display = "flex";
      bigScore.style.display = "block";
      scoreLabel.style.display = "block";
    }
    bullets.forEach((bullet, bulletIndex) => {
      const dist = Math.hypot(bullet.x - meteor.x, bullet.y - meteor.y);
      //player dies
      if (dist - meteor.radius - bullet.radius < 1) {
        score += 100;
        scoreBoard.innerHTML = score;
        bigScore.innerHTML = score;
        if (meteor.colour === "red" && score > 1000) {
          meteor.colour = "orange";
          bullets.splice(bulletIndex, 1);
        } else {
          meteors.splice(meteorIndex, 1);
          bullets.splice(bulletIndex, 1);
        }
      } //everytime will check if the distance is smaller than 1 then take out the bullet and meteor
    });
  });
}

// //This is when window resize it will also resize the canvas
window.addEventListener("resize", handleCanvasSize);
//Whenever there is a click it will activate bullet
window.addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.clientHeight - 10,
    event.clientX - canvas.clientWidth / 2
  );
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };
  bullets.push(
    new Bullet(
      canvas.clientWidth / 2,
      canvas.clientHeight - 10,
      5,
      "black",
      velocity
    )
  ); //make new bullet and push into the array
}); //check when click to get value of the mouse click x and y and calculate the velocity

startButton.addEventListener("click", () => {
  resetGame();
  animate();
  spawnMeteors();
}); //when start button is click
