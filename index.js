const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const startButton = document.querySelector("button");

const global = {
  inPlay: false,
  arcs: [],
  lines: [],
  computerArcs: [],
  playerArcs: [],
  playerChoices: 0,
  mouseX: null,
  mouseY: null,
  mouseEnabled: false,
  clicked: false,
  activeArc: null,
  playerMoving: false,
  computerMoving: false,
  turn: 1,
  gameOverIndex: 0,
  beeps: [
    new Audio("./audio/beep1.m4a"),
    new Audio("./audio/beep2.mp3"),
    new Audio("./audio/beep3.mp3"),
    new Audio("./audio/beep4.mp3"),
  ],
  ahh: new Audio("./audio/ahh.mp3"),
};

const adjustVolumeOfBeeps = () => {
  const beeps = global.beeps;
  beeps[0].volume = 0.2;
  beeps[1].volume = 0.5;
  beeps[2].volume = 0.4;
  beeps[3].volume = 0.8;
};

const playBeep = () => {
  const beeps = global.beeps;
  if (global.activeArc.id === 1) {
    beeps[0].play();
  } else if (global.activeArc.id === 2) {
    beeps[1].play();
  } else if (global.activeArc.id === 3) {
    beeps[2].play();
  } else if (global.activeArc.id === 4) {
    beeps[3].play();
  }
};

const startGame = () => {
  displayTurnNumber();
  global.computerMoving = true;
  global.inPlay = true;
  computersTurn();
  startButton.setAttribute("disabled", true);
  startButton.style.backgroundColor = "black";
  startButton.style.color = "white";
};

const displayTurnNumber = () => {
  const canvasContainer = document.querySelector(".canvas-container");
  const turnNumberContainer = document.createElement("div");
  turnNumberContainer.classList.add("turn-number-container");
  canvasContainer.appendChild(turnNumberContainer);
  const turnNumberText = document.createElement("span");
  turnNumberText.innerText = global.turn;
  turnNumberText.classList.add("turn-number-text");
  turnNumberContainer.appendChild(turnNumberText);
};

const incrementTurnNumber = () => {
  global.turn++;
  const turnNumberText = document.querySelector(".turn-number-text");
  turnNumberText.innerText = global.turn;
};

const dropActiveArcs = () => {
  for (let i = 0; i < global.arcs.length; i++) {
    global.arcs[i].active = false;
    global.activeArc = [];
  }
};

const restartGame = () => {
  global.ahh.play();
  global.inPlay = false;
  global.computerArcs = [];
  global.playerArcs = [];
  global.playerChoices = 0;
  global.mouseX = null;
  global.mouseY = null;
  global.mouseEnabled = false;
  global.clicked = false;
  global.activeArc = [];
  global.playerMoving = false;
  global.computerMoving = false;
  global.turn = 1;

  const turnNumberText = document.querySelector(".turn-number-text");
  turnNumberText.remove();
  startButton.innerText = "Ouch..";
  setTimeout(() => {
    startButton.innerText = "Start";
    startButton.removeAttribute("disabled");
    startButton.style.backgroundColor = "white";
    startButton.style.color = "black";
  }, 1000);
};

const checkForGameOver = () => {
  const player = [];
  const cpu = [];
  let index = global.playerChoices - 1;

  for (let i = 0; i < global.playerArcs.length; i++) {
    player.push(global.playerArcs[i].id);
  }
  for (let i = 0; i < global.computerArcs.length; i++) {
    cpu.push(global.computerArcs[i].id);
  }
  if (player[index] !== cpu[index]) {
    console.log("game over");
    restartGame();
  }
};

const playerClicksArc = (index) => {
  if (!global.activeArc.length && global.mouseEnabled && global.playerMoving) {
    global.clicked = false;
    global.mouseEnabled = false;
    global.playerChoices++;
    global.activeArc = global.arcs[index];
    global.arcs[index].active = true;
    global.playerArcs.push(global.arcs[index]);
    playBeep();
    checkForGameOver();
    setTimeout(() => {
      dropActiveArcs();
      global.mouseEnabled = true;
    }, 1000);
  }
};

const endComputersTurn = () => {
  global.computerMoving = false;
  global.playerMoving = true;
  global.mouseEnabled = true;
};

const activateRandomArc = () => {
  setTimeout(() => {
    const arcs = global.arcs;
    const randomNumber = Math.floor(Math.random() * arcs.length);
    global.activeArc = arcs[randomNumber];
    arcs[randomNumber].active = true;
    global.computerArcs.push(arcs[randomNumber]);
    playBeep();
  }, 1000);
  setTimeout(() => {
    dropActiveArcs();
    endComputersTurn();
  }, 2000);
};

const activateArcByIndex = (index) => {
  setTimeout(() => {
    global.mouseEnabled = false;
    global.activeArc = global.computerArcs[index];
    global.computerArcs[index].active = true;
    playBeep();
  }, 1000);
  setTimeout(() => {
    dropActiveArcs();
  }, 2000);
};

const computersTurn = () => {
  if (global.computerMoving) {
    startButton.innerText = "Computer's Turn..";
    if (global.computerArcs.length) {
      activatePreviousArcs(0);
    } else {
      activateRandomArc();
    }
  }
};

const playersTurn = () => {
  if (global.playerMoving) {
    startButton.innerText = "Player's Turn..";
    if (global.playerChoices === global.computerArcs.length) {
      endPlayersTurn();
    }
  }
};

const endPlayersTurn = () => {
  global.playerArcs = [];
  global.playerChoices = 0;
  global.playerMoving = false;
  global.computerMoving = true;
  global.mouseEnabled = false;
  setTimeout(() => {
    incrementTurnNumber();
    computersTurn();
  }, 1000);
};

const activatePreviousArcs = (index) => {
  if (index === global.computerArcs.length) {
    activateRandomArc();
  } else {
    activateArcByIndex(index);
    setTimeout(() => {
      activatePreviousArcs(index + 1);
    }, 2000);
  }
};

const handleStartButtonClick = () => {
  startGame();
};

startButton.addEventListener("click", handleStartButtonClick);

const getMouseCoordinates = (e) => {
  const root = document.documentElement;
  const rect = canvas.getBoundingClientRect();
  let x = e.clientX - root.scrollLeft - rect.left;
  let y = e.clientY - root.scrollTop - rect.top;
  global.mouseX = x;
  global.mouseY = y;
};

const handleMouseMove = (e) => {
  getMouseCoordinates(e);
};

const handleMouseDown = () => {
  if (global.mouseEnabled) global.clicked = true;
};

const handleMouseUp = () => {
  global.clicked = false;
};

window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mouseup", handleMouseUp);

class Arc {
  constructor(start, end, id) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.start = start;
    this.end = end;
    this.radius = 250;
    this.id = id;
    this.brightness = 100;
    this.active = false;
  }

  draw() {
    if (this.id === 1) ctx.fillStyle = "darkred";
    if (this.id === 2) ctx.fillStyle = "green";
    if (this.id === 3) ctx.fillStyle = "#FFBF00";
    if (this.id === 4) ctx.fillStyle = "#0066b2";
    if (this.active) this.brightness = 200;
    if (!this.active) this.brightness = 100;
    ctx.filter = `brightness(${this.brightness}%)`;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(
      this.x,
      this.y,
      this.radius,
      (this.start * Math.PI) / 180,
      (this.end * Math.PI) / 180,
      true
    );
    ctx.fill();
  }

  mouseCollision() {
    let dx, dy, distance;
    if (global.mouseX > this.x) {
      dx = global.mouseX - this.x;
    } else {
      dx = this.x - global.mouseX;
    }
    if (global.mouseY > this.y) {
      dy = global.mouseY - this.y;
    } else {
      dy = this.y - global.mouseY;
    }
    distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius && global.clicked && global.mouseEnabled) {
      if (
        global.mouseX > canvas.width / 2 &&
        global.mouseY < canvas.height / 2
      ) {
        playerClicksArc(0); // red
      }
      if (
        global.mouseX < canvas.width / 2 &&
        global.mouseY < canvas.height / 2
      ) {
        playerClicksArc(1); // green
      }
      if (
        global.mouseX < canvas.width / 2 &&
        global.mouseY > canvas.height / 2
      ) {
        playerClicksArc(2); // yellow
      }
      if (
        global.mouseX > canvas.width / 2 &&
        global.mouseY > canvas.height / 2
      ) {
        playerClicksArc(3); // blue
      }
    }
  }
}

class Counter {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 50;
    this.mouseOver = false;
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  mouseCollision() {
    let dx, dy, distance;
    if (global.mouseX > this.x) {
      dx = global.mouseX - this.x;
    } else {
      dx = this.x - global.mouseX;
    }
    if (global.mouseY > this.y) {
      dy = global.mouseY - this.y;
    } else {
      dy = this.y - global.mouseY;
    }
    distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius) {
      this.mouseOver = true;
    } else {
      this.mouseOver = false;
    }
  }
}

class Outline {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 250;
  }

  draw() {
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class Line {
  constructor(direction, end) {
    this.direction = direction;
    this.end = end;
  }

  draw() {
    ctx.lineWidth = 10;
    if (this.direction === "vertical") {
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.lineTo(canvas.width / 2, canvas.height / 2 + this.end);
      ctx.stroke();
    } else if (this.direction === "horizontal") {
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + this.end, canvas.height / 2);
      ctx.stroke();
    }
  }
}

const createLines = () => {
  for (let i = 0; i < 4; i++) {
    if (i === 0) {
      const line = new Line("horizontal", -250);
      global.lines.push(line);
    }
    if (i === 1) {
      const line = new Line("horizontal", 250);
      global.lines.push(line);
    }
    if (i === 2) {
      const line = new Line("vertical", 250);
      global.lines.push(line);
    }
    if (i === 3) {
      const line = new Line("vertical", -250);
      global.lines.push(line);
    }
  }
};

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  global.arcs.forEach((arc) => {
    arc.draw();
    arc.mouseCollision();
  });
  outline.draw();
  global.lines.forEach((line) => {
    line.draw();
  });
  playersTurn();
  counter.draw();
  counter.mouseCollision();
  window.requestAnimationFrame(animate);
};

const arc1 = new Arc(0, -90, 1);
const arc2 = new Arc(-90, -180, 2);
const arc3 = new Arc(-180, -270, 3);
const arc4 = new Arc(-270, -360, 4);
const counter = new Counter();
const outline = new Outline();
global.arcs.push(arc1, arc2, arc3, arc4);
createLines();
adjustVolumeOfBeeps();
animate();
