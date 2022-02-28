const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

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
  update() {
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
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

// //Call the function out so that at the very start it will be the right size
handleCanvasSize();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.clientWidth, canvas.height); //Every time the loop runs it will clear the drawing hence will look like a bullet moving only
  player.draw();
  bullets.forEach((bullet) => {
    bullet.update();
    bullet.draw();
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
    x: Math.cos(angle),
    y: Math.sin(angle),
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

const x = canvas.clientWidth / 2;
const y = canvas.clientHeight - 10; //10 cause player size is 10
const player = new Player(x, y, 10, "#black");

const bullets = [];

animate();
