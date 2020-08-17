// Настройка холста
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Получаем ширину и высоту элемента canvas
var width = canvas.width;
var height = canvas.height;

// Вычисляем ширину и высоту в ячейках
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// Устанавливаем счет 0
var score = 0;

// Рисуем рамку
var drawBorder = function() {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Выводим счет игры в левом верхнем углу
var drawScore = function() {
  ctx.font = "20px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Счет: " + score, blockSize, blockSize);
};

// Отменяем действие setInterval и печатаем сообщение "Конец"
var gameOver = function() {
  // clearInterval(intervalId);
  ctx.font = "60px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Конец игры", width/2, height/2);
};

var circle = function(x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2, fillCircle);
  if(fillCircle) {
    ctx.fill();
  }else {
    ctx.stroke();
  }
};

var Block = function(col, row) {
  this.col = col;
  this.row = row;
};

Block.prototype.drawSquare = function(color) {
  var x = this.col * blockSize;
  var y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function(color) {
  var centerX = this.col * blockSize + blockSize/2;
  var centerY = this.row * blockSize + blockSize/2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize/2, true);
};

Block.prototype.equal = function(otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};

var Snake = function() {
  this.segments = [
    new Block(7, 5),
    new Block(6, 5),
    new Block(5, 5)
  ];
  this.direction = "right";
  this.nextDirection = "right";
};
Snake.prototype.draw = function() {
  for (let i = 0; i < this.segments.length; i++) {
    var colors = ["Green", "Blue", "Red"];
    if(i === 0) {
      this.segments[i].drawSquare(colors[0]);
    }
    if(i%2 === 0 && i > 0) {
      this.segments[i].drawSquare(colors[1]);
    }
    if(i%2 !== 0 && i > 0) {
      this.segments[i].drawSquare(colors[2]);
    }
  }
};
var gameStats = true;
Snake.prototype.move = function() {
  var head = this.segments[0];
  var newHead;

  this.direction = this.nextDirection;

  if(this.direction === "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if(this.direction === "down") {
    newHead = new Block(head.col, head.row + 1);
  } else if(this.direction === "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if(this.direction === "up") {
    newHead = new Block(head.col, head.row - 1);
  }

  if(this.checkCollision(newHead)) {
    gameOver();
    gameStats = false;
    return;
  }

  this.segments.unshift(newHead);

  if(newHead.equal(apple.position)) {
    score++;
    if(animationTime > 0) {
      animationTime--;
    }
    apple.move(this.segments);
  } else {
    this.segments.pop();
  }
};

Snake.prototype.checkCollision = function(head) {
  var leftCollision = (head.col === 0);
  var topCollision = (head.row === 0);
  var rightCollision = (head.col === widthInBlocks - 1);
  var bottomCollision = (head.row === heightInBlocks - 1);

  var wallCollision = leftCollision || topCollision || rightCollision|| bottomCollision;

  var selfCollision = false;
  for (let i = 0; i < this.segments.length; i++) {
    if(head.equal(this.segments[i])){
      selfCollision = true;
    }
  }
  return wallCollision || selfCollision;
};

var directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};

$("body").keydown(function(event){
  var newDirection = directions[event.keyCode];
  if(newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});

Snake.prototype.setDirection = function(newDirection) {
  if(this.direction === "up" && newDirection === "down") {
    return;
  } else if(this.direction === "right" && newDirection === "left") {
    return;
  } else if(this.direction === "down" && newDirection === "up") {
    return;
  } else if(this.direction === "left" && newDirection === "right") {
    return;
  }
  this.nextDirection = newDirection;
};

var Apple = function() {
  this.position = new Block(10, 10);
};

Apple.prototype.draw = function() {
  this.position.drawCircle("LimeGreen");
};

Apple.prototype.move = function(occupiedBlocks) {
  var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
  var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
  this.position = new Block(randomCol, randomRow);

  var index = occupiedBlocks.length - 1;
  while(index >= 0) {
    if(this.position.equal(occupiedBlocks[index])){
      this.move(occupiedBlocks);
      return;
    }
    index--;
  }
}
var apple = new Apple()
var snake = new Snake();


var animationTime = 100;
var gameLoop = function() {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();
  var stopTimeOut = setTimeout(gameLoop, animationTime);
  if(!gameStats) {
    clearTimeout(stopTimeOut);
  }
};
gameLoop();
// var intervalId = setInterval(function() {
//   ctx.clearRect(0, 0, width, height);
//   drawScore();
//   snake.move();
//   snake.draw();
//   apple.draw();
//   drawBorder();
// }, 100);