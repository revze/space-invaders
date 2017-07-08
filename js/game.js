let arenaWidth = 800;
let arenaHeight = 480;

let gamePointArea;
let gameSpace;
let spaceWantToShot;
let spaceShooter;
let isShootingAlien;
let shotWhenStart = false;
let gameAlien = [];
let alienState;
let outsideArena = -100;

let scoreText;
let btnPause;
let textPause;
let textHighScore;

let btnRetry;
let textRetry;

let gameStatus;
let gameScore = 0;
let maxScore = 550;

function startGame() {
  gameArea.start();
  gameScore = 0;
  if (localStorage.getItem('highScore') == null) {
    localStorage.setItem('highScore', gameScore);
  }
  gameStatus = 'started';
  gamePointArea = new component(arenaWidth, arenaHeight / 4, 'gray', 0, arenaHeight - (arenaHeight / 4));
  gameSpace = new warobject(45, 35, 'img/sprite.png', (arenaWidth / 2) - (45 / 2), gamePointArea.y + (gamePointArea.height / 2) + 10, 400, 0, 77, 65, '');
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
      let alienArray = 'alien-'+i+j;
      if (i >= 0 || i <= 2) {
        gameAlien[alienArray] = new warobject(35, 25, 'img/sprite.png', (j * 45) + 0, (i * 35) + 60, 0, 0, 112, 84, 'war');
      }
      if (i > 2) {
        gameAlien[alienArray] = new warobject(35, 25, 'img/sprite.png', (j * 45) + 0, (i * 35) + 60, 230, 0, 80, 76, 'war');
      }
    }
  }
  alienState = 'advance';
  spaceShooter = new component(5, 16, 'white', gameSpace.x + (gameSpace.width / 2) - (6 / 2), gameSpace.y - gameSpace.height);
  scoreText = new component('18px', 'Helvetica', 'white', (arenaWidth / 2) - 50, 35, 'text');
  scoreText.text = 'Score: 0';
  textHighScore = new component('18px', 'Helvetica', 'white', 20, 35, 'text');
  textHighScore.text = 'High Score: ' + localStorage.getItem('highScore');
  btnPause = new component(110, 35, 'gray', (arenaWidth * 3/4) + 70, 18);
  textPause = new component('18px', 'Helvetica', 'white', (arenaWidth * 3/4) + 100, (btnPause.height/2) + 23, 'text');
  textPause.text = 'Pause';
  spaceShooter.speedY = 0;
  spaceShooter.y = outsideArena;
  spaceShooter.x = outsideArena;
  spaceShooter.newPos();
  spaceShooter.update();
  spaceWantToShot = false;
  isShootingAlien = false;
}

let gameArea = {
  start   : function() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.canvas.focus();
    this.context = this.canvas.getContext('2d');
    this.interval = setInterval(updateGameArea, 20);
    this.intervalpause = '';
    this.intervallose = '';
    window.addEventListener('keydown', function(e) {
      gameArea.key = e.keyCode;
    });
    window.addEventListener('keyup', function(e) {
      gameArea.key = false;
    });
    this.canvas.addEventListener('mousedown', function(e) {
      gameArea.x = e.offsetX;
      gameArea.y = e.offsetY;
    });
    this.canvas.addEventListener('mouseup', function(e) {
      gameArea.x = false;
      gameArea.y = false;
    });
    this.canvas.addEventListener('touchstart', function(e) {
      gameArea.x = e.offsetX;
      gameArea.y = e.offsetY;
    });
    this.canvas.addEventListener('touchend', function(e) {
      gameArea.x = false;
      gameArea.y = false;
    });
  },
  clear   : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y, type) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.type = type;
  this.update = function() {
    ctx = gameArea.context;
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
    if ((mybottom < gameArea.y) || (mytop > gameArea.y) || (myright < gameArea.x) || (myleft > gameArea.x) || (gameArea.x == undefined) || (gameArea.y == undefined)) {
      clicked = false;
    }
    return clicked;
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  this.clear = function() {
    this.x = outsideArena;
    this.y = outsideArena;
  }
}

function warobject(width, height, color, x, y, spriteX, spriteY, spriteWidth, spriteHeight, status) {
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.image.src = color;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.spriteX = spriteX;
  this.spriteY = spriteY;
  this.spriteWidth = spriteWidth;
  this.spriteHeight = spriteHeight;
  this.status = status;
  this.update = function() {
    ctx = gameArea.context;
    ctx.drawImage(this.image, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  this.isOnTarget = function() {
    let alienleft = this.x;
    let alienright = this.x + (this.width);
    let alientop = this.y;
    let alienbottom = this.y + (this.height);
    let ontarget = true;
    if ((alienbottom < spaceShooter.y) || (alientop > spaceShooter.y) || (alienright < spaceShooter.x) || (alienleft > spaceShooter.x)) {
      ontarget = false;
    }
    return ontarget;
  }
}

function updateGameArea() {
  gameArea.clear();
  gamePointArea.update();
  initialAlienPos();
  initialSpacePos();
  initialGameMenu();
  checkGameStatus();
}

function initialSpacePos() {
  gameSpace.update();
  if (gameArea.key && gameArea.key == 65) {
    gameSpace.speedX = -4;
    if (gameSpace.x <= 15) {
      gameSpace.speedX = 0;
    }
    if (shotWhenStart == false) {
      spaceShooter.x = gameSpace.x + (gameSpace.width / 2) - (spaceShooter.width / 2);
      spaceShooter.y = gameSpace.y - gameSpace.height + gameSpace.height;
      spaceShooter.newPos();
    }
    gameSpace.newPos();
  }
  if (gameArea.key && gameArea.key == 68) {
    gameSpace.speedX = 4;
    if (gameSpace.x >= arenaWidth - gameSpace.width - 15) {
      gameSpace.speedX = 0;
    }
    if (shotWhenStart == false) {
      spaceShooter.x = gameSpace.x + (gameSpace.width / 2) - (spaceShooter.width / 2);
      spaceShooter.y = gameSpace.y - gameSpace.height + gameSpace.height;
      spaceShooter.newPos();
    }
    gameSpace.newPos();
  }
  if (gameArea.key && gameArea.key == 32) {
    spaceWantToShot = true;
    if (isShootingAlien == false) {
      spaceShooter.x = gameSpace.x + (gameSpace.width / 2) - (spaceShooter.width / 2);
      spaceShooter.y = gameSpace.y - gameSpace.height + gameSpace.height;
    }
  }

  if (spaceWantToShot) {
    shotWhenStart = true;
    isShootingAlien = true;
    spaceShooter.speedY = -5;
    spaceShooter.newPos();
    if (spaceShooter.y < -spaceShooter.height) {
      spaceWantToShot = false;
      isShootingAlien = false;
    }
    spaceShooter.update();
  }
}

function initialAlienPos() {
  if (alienState == 'advance') {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 11; j++) {
        let alienArray = 'alien-'+i+j;
        if (gameAlien[alienArray].status == 'war') {
          gameAlien[alienArray].speedX = 1;
          gameAlien[alienArray].newPos();
          gameAlien[alienArray].update();
          if (gameAlien[alienArray].x >= arenaWidth - gameAlien[alienArray].width) {
            alienState = 'retreat_zigzag';
          }
        }
      }
    }
  }
  if (alienState == 'retreat_zigzag') {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 11; j++) {
        let alienArray = 'alien-'+i+j;
        if (gameAlien[alienArray].status == 'war') {
          gameAlien[alienArray].speedX = -1;
          gameAlien[alienArray].speedY = 0.1;
          gameAlien[alienArray].newPos();
          gameAlien[alienArray].update();
          if (gameAlien[alienArray].x <= 0) {
            alienState = 'advance_zigzag';
          }
        }
      }
    }
  }
  if (alienState == 'advance_zigzag') {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 11; j++) {
        let alienArray = 'alien-'+i+j;
        if (gameAlien[alienArray].status == 'war') {
          gameAlien[alienArray].speedX = 1;
          gameAlien[alienArray].speedY = 0.1;
          gameAlien[alienArray].newPos();
          gameAlien[alienArray].update();
          if (gameAlien[alienArray].x >= arenaWidth - gameAlien[alienArray].width) {
            alienState = 'retreat_zigzag';
          }
        }
      }
    }
  }
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
      let alienArray = 'alien-'+i+j;
      if (gameAlien[alienArray].status == 'war' && gameAlien[alienArray].y >= arenaHeight - gamePointArea.height - gameAlien[alienArray].height) {
        gameStatus = 'lose';
        break;
      }
    }
  }
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
      let alienArray = 'alien-'+i+j;
      if (gameAlien[alienArray].status == 'war' && gameAlien[alienArray].isOnTarget()) {
        gameAlien[alienArray].x = outsideArena;
        gameAlien[alienArray].y = outsideArena;
        gameAlien[alienArray].width = 0;
        gameAlien[alienArray].height = 0;
        gameAlien[alienArray].status = 'dead';
        spaceShooter.speedY = 0;
        spaceShooter.y = outsideArena;
        spaceShooter.x = outsideArena;
        spaceShooter.newPos();
        spaceShooter.update();
        spaceWantToShot = false;
        isShootingAlien = false;
        gameScore += 10;
        if (gameScore == maxScore) {
          setTimeout(function(){
            gameStatus = 'win';
            if (gameScore > localStorage.getItem('highScore')) {
              localStorage.setItem('highScore', gameScore);
              textHighScore.text = 'High Score: ' + localStorage.getItem('highScore');
            }
          },250);
        }
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
      let alienArray = 'alien-'+i+j;
      if ((i >= 0 || i <= 2) && gameAlien[alienArray].status == 'war') {
        if (gameAlien[alienArray].spriteX == 0) {
          setTimeout(function(){
            gameAlien[alienArray].spriteX = 109;
            gameAlien[alienArray].spriteWidth = 115;
            gameAlien[alienArray].spriteHeight = 76;
          },250);
        }
        else if (gameAlien[alienArray].spriteX == 109) {
          setTimeout(function(){
            gameAlien[alienArray].spriteX = 0;
            gameAlien[alienArray].spriteWidth = 112;
            gameAlien[alienArray].spriteHeight = 84;
          },250);
        }
      }
      if (i > 2 && gameAlien[alienArray].status == 'war') {
        if (gameAlien[alienArray].spriteX == 230) {
          setTimeout(function(){
            gameAlien[alienArray].spriteX = 310;
            gameAlien[alienArray].spriteWidth = 87;
            gameAlien[alienArray].spriteHeight = 76;
          },250);
        }
        else if (gameAlien[alienArray].spriteX == 310) {
          setTimeout(function(){
            gameAlien[alienArray].spriteX = 230;
            gameAlien[alienArray].spriteWidth = 80;
            gameAlien[alienArray].spriteHeight = 76;
          },250);
        }
      }
    }
  }
}

function checkGameStatus() {
  if (gameStatus == 'win') {
    alert('Player win.');
    clearInterval(gameArea.interval);
    spaceInvaders.interval = setInterval(startSpaceInvaders, 20);
  }
  if (gameStatus == 'lose') {
    alert('Game over.');
    if (gameScore > localStorage.getItem('highScore')) {
      localStorage.setItem('highScore', gameScore);
      textHighScore.text = 'High Score: ' + localStorage.getItem('highScore');
    }
    clearInterval(gameArea.interval);
    btnRetry = new startcomponent(110, 35, 'gray', (arenaWidth / 2) - (110 / 2), (arenaHeight / 2) - (35 / 2));
    textRetry = new startcomponent('18px', 'Helvetica', 'white', (arenaWidth / 2) - (btnRetry.width / 2) + 35, (arenaHeight / 2) - (btnRetry.height / 2) + 23, 'text');
    textRetry.text = 'Retry';
    gameArea.intervallose = setInterval(loseGameUpdate, 20);
  }
}

function initialGameMenu() {
  scoreText.text = 'Score: ' + gameScore;
  scoreText.update();
  btnPause.update();
  textPause.update();
  textHighScore.update();

  if (gameArea.x && gameArea.y) {
    if (btnPause.clicked()) {
      if (gameStatus == 'started' || gameStatus == 'resumed') {
        gameStatus = 'paused';
        textPause.text = 'Resume';
        textPause.x = (arenaWidth * 3/4) + 92;
        gameArea.x = false;
        gameArea.y = false;
        setTimeout(function() {
          clearInterval(gameArea.interval);
          gameArea.intervalpause = setInterval(pauseGameArea, 20);
        },20);
      }
    }
  }
}

function pauseGameArea() {
  if (gameArea.x && gameArea.y) {
    if (btnPause.clicked()) {
      if (gameStatus == 'paused') {
        gameStatus = 'resumed';
        textPause.text = 'Pause';
        textPause.x = (arenaWidth * 3/4) + 100;
        gameArea.x = false;
        gameArea.y = false;
        setTimeout(function() {
          clearInterval(gameArea.intervalpause);
          gameArea.interval = setInterval(updateGameArea, 20);
        },20);
      }
    }
  }
}

function loseGameUpdate() {
  gameArea.clear();
  btnRetry.update();
  textRetry.update();
  textHighScore.update();

  if (gameArea.x && gameArea.y) {
    if (btnRetry.clicked()) {
      if (gameStatus == 'lose') {
        clearInterval(gameArea.intervallose);
        startGame();
      }
    }
  }
}
