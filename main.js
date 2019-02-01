window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
    if (frames !== 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      location.reload();
      ctx.restore();
      obstaculos = [];
      flappy.draw();
      frames = 0;

      start();
    }
   
  };

  function startGame() {
  
  ctx.font = "40px Avenir";
  ctx.fillStyle = "white";
  ctx.fillText("Press Start Game to start", 210, 250);

  {
    isRunning = true;
    interval = setInterval(update, 1000 / 60);
  }
};


let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let interval;
let images = {
  bg:
    "imagenes/pixil-frame-0 (4).png",
  cerdito:
    "imagenes/pixil-frame-0 (2).png",
  topObstaculo:
    "imagenes/pixil-frame-0 (3).png",
  bottomObstaculo:
    "imagenes/pixil-frame-0 (3).png",
  perdi:
    "imagenes/pixil-frame-0 (5).png",
  cerditoMuerto:
  "imagenes/pixil-frame-0 (1).png",
  cheve: "./imagenes/cheve.png"
};
let sounds = {
  jump: "SONIDOS/pig-oink cerdo.mp3",
  crash: "SONIDOS/animals024.mp3"
};
let frames = 0;
let obstaculos = [];
let cervezasArray = [];
let isRunning = false;
let cervezasTaken = 0;

//Clases
function Board() {
  this.x = 0;
  this.y = 0;
  this.width = canvas.width;
  this.height = canvas.height;
  this.image = new Image();
  this.image.src = images.bg;
  
  this.draw = function() {
    if (this.x < -canvas.width) this.x = 0;
    this.x-=2;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  };
  
  this.image.onload = this.draw.bind(this);
}

let score = {
  x: 0,
  y: 0,
  draw: function() {
    ctx.fillStyle = "red";
    ctx.fillRect(327, 7, 200, 30);
  }
};

function drawTime() {
  ctx.fillStyle = "white";
  
  ctx.fillText("Cervezas " + cervezasTaken,  330, 30 );
}


class Cerdito {
  constructor() {
    this.x = 150;
    this.y = 150;
    this.width = 67;
    this.height = 60; 
    this.image = new Image();
    this.image.src = images.cerdito;
    this.image.onload = this.draw.bind(this);
  }
  draw() {
    
    if (this.y < canvas.height - this.height) this.y += 0;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

 
  checkIfTouch(obstaculo) {
    return (
      this.x < obstaculo.x + obstaculo.width &&
      this.x + this.width > obstaculo.x &&
      this.y < obstaculo.y + obstaculo.height &&
      this.y + this.height > obstaculo.y
    );
  }
}

function Obstaculo() {
  this.x = canvas.width + 10;
  
  this.y = Math.floor(Math.random() * 160) + 100 ;
  this.width = 50;
  this.height = 50;
  this.image = new Image();
  this.image.src = images.topObstaculo;
  this.draw = function() {
    this.x -= 3;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
  this.image.onload = this.draw.bind(this);
}

function Cerveza() {
  this.x = canvas.width + 10;
  
  this.y = Math.floor(Math.random() * 160) + 100 ;
  this.width = 40;
  this.height = 40;
  this.image = new Image();
  this.image.src = images.cheve;
  this.draw = function() {
    this.x -= 2.5;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
  this.image.onload = this.draw.bind(this);
}


let board = new Board();
let cerdito = new Cerdito();
let obstaculo1 = new Obstaculo();




function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frames++;
  board.draw();

  generateObstaculos();
  generateCheve();
  drawObstaculos();
  drawChelas();
  cerdito.draw();
  checkCollision();
  checkCollisionGood();
  score.draw();
  drawTime();
  
}

function gameOver() {
  let back = document.getElementById("bg");
  back.classList.toggle("background-red");
  isRunning = false;
  clearInterval(interval);
  ctx.fillStyle = "black";
  ctx.fillText("Turno del Jugador 2",300,400);
  ctx.fillText("Presiona el botón para reiniciar", 200, 300);

  audioCrash.play();
  
}


function generateObstaculos() {

  let times = [200];
  let i = Math.floor(Math.random() * times.length);

  if (frames % times[i] !== 0) return;
  //let height = Math.floor(Math.random() * 300) + 50;
  let top = new Obstaculo();
  //let y = height + 100;
//   let height2 = canvas.height - y;
//   let bottom = new Obstaculo (height2, y, false);
  obstaculos.push(top);
//   obstaculos.push(bottom);
}

function generateCheve(){
  let times = [200];
  let i = Math.floor(Math.random() * times.length);
  if (frames % times[i] !== 0) return;
  let cerveza = new Cerveza();
  cervezasArray.push(cerveza);

}

function drawChelas() {
  cervezasArray.forEach((cheve, index) => {
   
    //if (cheve.x < -60) cervezasArray.splice(index, 1);
    cheve.draw();
  });
}



function drawObstaculos() {
  obstaculos.forEach((obstaculo, index) => {
   
    if (obstaculo.x < -60) obstaculos.splice(index, 1);
    obstaculo.draw();
  });
}

function checkCollisionGood(){
  cervezasArray.forEach((cheve, index) => {
    if(cerdito.checkIfTouch(cheve)){
      cervezasTaken++;
      cervezasArray.splice(index, 1)
    }
  })
}

function checkCollision() {
  obstaculos.forEach(obstaculo => {
    if (cerdito.checkIfTouch(obstaculo)) {
      gameOver();
    }
  });
}

addEventListener("keydown", e => {
  if (e.keyCode === 38 ) {
    e.preventDefault();
  
    if (cerdito.y > 100) cerdito.y -= 15;
    e.preventDefault();
 
    audioJump.currentTime = 0;
    if (isRunning) audioJump.play();
    
  }
});
addEventListener("keydown", e => {
    if (e.keyCode === 40) {
      e.preventDefault();
     
      if (cerdito.y < 260) cerdito.y += 15;
      e.preventDefault();
    
      audioJump.currentTime = 0;
      if (isRunning) audioJump.play();
      
    }
  });


let audioJump = new Audio();
audioJump.src = sounds.jump;

let audioCrash = new Audio();
audioCrash.src = sounds.crash;
}