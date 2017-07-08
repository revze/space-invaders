let btnStart;
let textStart;
let highScoreStart;

function createStartScreen() {
  spaceInvaders.createGame();
  if (localStorage.getItem('highScore') == null) {
    localStorage.setItem('highScore', 0);
  }
  btnStart = new startcomponent(110, 35, 'gray', (spaceInvaders.canvas.width / 2) - (110 / 2), (spaceInvaders.canvas.height / 2) - (35 / 2));
  textStart = new startcomponent('18px', 'Helvetica', 'white', (spaceInvaders.canvas.width / 2) - (btnStart.width / 2) + 9, (spaceInvaders.canvas.height / 2) - (btnStart.height / 2) + 23, 'text');
  textStart.text = 'Start Game';
  highScoreStart = new startcomponent('18px', 'Helvetica', 'white', 20, 35, 'text');
  highScoreStart.text = 'High Score: ' + localStorage.getItem('highScore');
}

let spaceInvaders = {
  canvas  : document.createElement('canvas'),
  createGame   : function() {
    this.canvas.focus();
    this.canvas.width = 800;
    this.canvas.height = 480;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(startSpaceInvaders, 20);
    window.addEventListener('keydown', function(e) {
      spaceInvaders.key = e.keyCode;
    });
    window.addEventListener('keyup', function(e) {
      spaceInvaders.key = false;
    });
    this.canvas.addEventListener('mousedown', function(e) {
      spaceInvaders.x = e.offsetX;
      spaceInvaders.y = e.offsetY;
    });
    this.canvas.addEventListener('mouseup', function(e) {
      spaceInvaders.x = false;
      spaceInvaders.y = false;
    });
    this.canvas.addEventListener('touchstart', function(e) {
      spaceInvaders.x = e.offsetX;
      spaceInvaders.y = e.offsetY;
    });
    this.canvas.addEventListener('touchend', function(e) {
      spaceInvaders.x = false;
      spaceInvaders.y = false;
    });
  },
  clear   : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function startcomponent(width, height, color, x, y, type) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.type = type;
  this.update = function() {
    ctx = spaceInvaders.context;
    if (this.type == 'text') {
      ctx.font = this.width + ' ' + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.clicked = function() {
    let myleft = this.x;
    let myright = this.x + (this.width);
    let mytop = this.y;
    let mybottom = this.y + (this.height);
    let clicked = true;
    if ((mybottom < spaceInvaders.y) || (mytop > spaceInvaders.y) || (myright < spaceInvaders.x) || (myleft > spaceInvaders.x) || (spaceInvaders.x == undefined) || (spaceInvaders.y == undefined)) {
      clicked = false;
    }
    return clicked;
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

function startSpaceInvaders() {
  spaceInvaders.clear();
  btnStart.update();
  textStart.update();
  highScoreStart.update();

  if (btnStart.clicked()) {
    startGame();
    clearInterval(spaceInvaders.interval);
  }
}
