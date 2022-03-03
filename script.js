const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
let bullets = [];
let meteors = [];
let animationId;
let score = 0;
let spawnTimer;
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

class Bullet extends Player {
  //Bullet which is a circle needs x, y, radius and colour
  constructor(x, y, radius, colour, velocity) {
    super(x, y, radius, colour);
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
  //Update is to update the new values as the frame goes
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Meteor extends Bullet {
  //Meteor which is a circle needs x, y, radius and colour
  constructor(x, y, radius, colour, velocity) {
    super(x, y, radius, colour, velocity);
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
  //Update is to update the new values as the frame goes
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//This is to change the canvas size according to container
function handleCanvasSize() {
  const container = document.getElementById("container");
  //Width to be same as the container
  canvas.width = container.clientWidth;
  //Minus the size of the div below containing the buildings
  canvas.height = container.clientHeight - 152;
  //Divide by2 to kee in center
  const x = canvas.clientWidth / 2;
  //Minus 10 from height cause its the size of the player
  const y = canvas.clientHeight - 10;
  const player = new Player(x, y, 10, "#black");
  player.draw();
}

//Call the function out so that at the very start it will be the right size
handleCanvasSize();

//This function will reset all arrays and score displays
function resetGame() {
  bullets = [];
  meteors = [];
  menuContainer.style.display = "none";
  score = 0;
  scoreBoard.innerHTML = score;
  bigScore.innerHTML = score;
}

//Every 1.5 second a new meteor will be pushed into the array
function spawnMeteors() {
  spawnTimer = setInterval(() => {
    //50 is the biggest 20 is the smallest
    const radius = Math.random() * (50 - 20) + 20;
    //Gets any number within the width
    const x = Math.random() * canvas.clientWidth;
    //Starts from outside of canvas
    const y = 0 - radius;
    const colour = "red";
    //Gets the angle of the triangle
    const angle = Math.atan2(
      canvas.clientHeight - 10 - y,
      canvas.clientWidth / 2 - x
    );
    //The ratio of the adjacent line and opposite line to push the bullet out towards to the correct direction via the angle
    const velocity = {
      x: 0,
      y: Math.sin(angle),
    };
    meteors.push(new Meteor(x, y, radius, colour, velocity));
  }, 1500);
}

function animate() {
  //Runs animate over and over again 60 frames per second
  animationId = requestAnimationFrame(animate);
  //Adjusting the canvas and replace itself while still drawing my player
  handleCanvasSize();
  bullets.forEach((bullet, bulletIndex) => {
    //Keeps updating the x and y value of bullet
    bullet.update();
    if (
      bullet.x + bullet.radius < 0 ||
      bullet.x - bullet.radius > canvas.clientWidth ||
      bullet.y + bullet.radius < 0
    ) {
      bullets.splice(bulletIndex, 1);
    } //If statement is to check if bullets go out of screen will it still be "appearing". If yes then splice them out.
  });
  meteors.forEach((meteor, meteorIndex) => {
    //Keeps updating the x and y value of bullet
    meteor.update();
    if (meteor.y + meteor.radius > canvas.clientHeight) {
      //This will stop all the animation via the frame ID
      cancelAnimationFrame(animationId);
      menuContainer.style.display = "flex";
      bigScore.style.display = "block";
      scoreLabel.style.display = "block";
      clearInterval(spawnTimer);
    }
    bullets.forEach((bullet, bulletIndex) => {
      const dist = Math.hypot(bullet.x - meteor.x, bullet.y - meteor.y);
      //If distance between meteor and bullet is less than 1 score will increase and also display on the scoreboard and the big menu score
      if (dist - meteor.radius - bullet.radius < 1) {
        score += 100;
        scoreBoard.innerHTML = score;
        bigScore.innerHTML = score;
        //When score is higher than 1000 then it will change its colour making the meteor 2 shot kill
        if (meteor.colour === "red" && score > 2000) {
          meteor.colour = "orange";
          bullets.splice(bulletIndex, 1);
          //When score is higher than 3000 then it will change its colour making the meteor 3 shot kill
        } else if (meteor.colour === "orange" && score > 5000) {
          meteor.colour = "maroon";
          bullets.splice(bulletIndex, 1);
          //Else splice them out of the array
        } else {
          meteors.splice(meteorIndex, 1);
          bullets.splice(bulletIndex, 1);
        }
      }
    });
  });
}

// //This is when window resize it will activate the handleCanvasSize function which will change the width and length of the canvas
window.addEventListener("resize", handleCanvasSize);

//Whenever there is a click in the window it will activate push a bullet into the array
window.addEventListener("click", (event) => {
  //Gets the angle of the triangle
  const angle = Math.atan2(
    event.clientY - canvas.clientHeight - 10,
    event.clientX - canvas.clientWidth / 2
  );
  //The ratio of the adjacent line and opposite line to push the bullet out towards to the correct direction via the angle
  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6,
  };
  bullets.push(
    new Bullet(
      canvas.clientWidth / 2,
      canvas.clientHeight - 10,
      5,
      "black",
      velocity
    )
  );
});

//When let's go button is click, the following functions will activate
startButton.addEventListener("click", () => {
  resetGame();
  animate();
  spawnMeteors();
});
