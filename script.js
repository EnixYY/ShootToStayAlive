const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

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

//This is to change the canvas size according to container
function handleCanvasSize() {
  const container = document.getElementById("container");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight - 152;
  const x = canvas.clientWidth / 2;
  const y = canvas.clientHeight - 10; //5 cause its the size of the player
  const player = new Player(x, y, 10, "#3b372c");
  player.draw();
}

// //Call the function out so that at the very start it will be the right size
handleCanvasSize();

// //This is when window resize it will also resize the canvas
window.addEventListener("resize", handleCanvasSize);

const x = canvas.clientWidth / 2;
const y = canvas.clientHeight - 10;
const player = new Player(x, y, 10, "#3b372c");
player.draw();
