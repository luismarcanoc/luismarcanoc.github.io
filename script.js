let slideIndex = 1;
let maxTurns = 25;
let message = "";

let miStorage = window.localStorage;

let player1 = {
  name: "Player 1",
  score: 0,
};
let player2 = {
  name: "Player 2",
  score: 0,
};
let player3 = {
  name: "Player 3",
  score: 0,
};
let player4 = {
  name: "Player 4",
  score: 0,
};
let cardSize = 0;

let numbersList = [];

let winnersList = [];

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

function startGame() {
  if (document.getElementById("player1").value === "") {
    document.getElementById("warning1").style.display = "block";
    return
  } else {
    document.getElementById("warning1").style.display = "none";
  }
  if (document.getElementById("player2").value === "") {
    document.getElementById("warning2").style.display = "block";
    return
  } else {
    document.getElementById("warning2").style.display = "none";
  }
  if (document.getElementById("player3").value === "") {
    document.getElementById("warning3").style.display = "block";
    return
  } else {
    document.getElementById("warning3").style.display = "none";
  }
  if (document.getElementById("player4").value === "") {
    document.getElementById("warning4").style.display = "block";
    return
  } else {
    document.getElementById("warning4").style.display = "none";
  }
  if (document.getElementById("max-turns").value === "") {
    document.getElementById("warningLimit").style.display = "block";
    return
  } else {
    document.getElementById("warningLimit").style.display = "none";
  }
  maxTurns = document.getElementById("max-turns").value*1;
  let game = document.getElementById("game");
  let gameConfig = document.getElementById("game-config");
  game.style.display = "flex";
  gameConfig.style.display = "none";

  player1.name = document.getElementById("player1").value;
  player2.name = document.getElementById("player2").value;
  player3.name = document.getElementById("player3").value;
  player4.name = document.getElementById("player4").value;

  cardSize = document.getElementById("card-size").value;

  //window.location.href = "./game.html";

  document.getElementById("player1-name").innerHTML = player1.name;
  document.getElementById("player2-name").innerHTML = player2.name;
  document.getElementById("player3-name").innerHTML = player3.name;
  document.getElementById("player4-name").innerHTML = player4.name;

  switch (cardSize) {
    case "random":
      cardSize = Math.floor(Math.random() * 3) + 3;
      break;
    case "3":
      cardSize = 3;
      break;
    case "4":
      cardSize = 4;
      break;
    case "5":
      cardSize = 5;
      break;
  }
  genGrid(cardSize, document.getElementById("card1"));
  genGrid(cardSize, document.getElementById("card2"));
  genGrid(cardSize, document.getElementById("card3"));
  genGrid(cardSize, document.getElementById("card4"));
}

function genGrid(v, card){
  let cardList = [];
  for(var i = 0; i < v; i++){ 
    var row = document.createElement("div"); 
    row.className = "card-row"; 
    row.style.height = 100/v + "%";
    for(var x = 1; x <= v; x++){ 
        var cell = document.createElement("div"); 
        cell.className = "gridsquare";
        var number = document.createElement("p");
        number.className = "number";
        number.innerText = Math.floor(Math.random() * 50) + 1;
        while (cardList.includes(number.innerText)) {
          number.innerText = Math.floor(Math.random() * 50) + 1;
          console.log("Duplicate found on "+card.id+" at "+number.innerText+"! Regenerating...");
        }
        cardList.push(number.innerText);
        cell.appendChild(number);
        row.appendChild(cell); 
    } 
    card.appendChild(row); 
  } 
}

function roll() {
  let roll = Math.floor(Math.random() * 50) + 1;
  let rollText = document.getElementById("ball");
  let turn = document.getElementById("turn");
  turn.innerHTML++;

  if (rollText.innerHTML !== "00") {
    document.getElementById("circle"+rollText.innerHTML).style.display = "flex";
  }

  while (numbersList.includes(roll)) {
    roll = Math.floor(Math.random() * 50) + 1;
  }
  if (roll < 10) {
    rollText.innerHTML = "0" + roll;
  } else {
    rollText.innerHTML = roll;
  }
  numbersList.push(roll);

  checkNumbers(document.getElementById("card1"), roll);
  checkNumbers(document.getElementById("card2"), roll);
  checkNumbers(document.getElementById("card3"), roll);
  checkNumbers(document.getElementById("card4"), roll);

  player1.score = checkPoints(document.getElementById("card1"));
  player2.score = checkPoints(document.getElementById("card2"));
  player3.score = checkPoints(document.getElementById("card3"));
  player4.score = checkPoints(document.getElementById("card4"));

  document.getElementById("player1-score").innerHTML = player1.score;
  document.getElementById("player2-score").innerHTML = player2.score;
  document.getElementById("player3-score").innerHTML = player3.score;
  document.getElementById("player4-score").innerHTML = player4.score;

  checkWinner(document.getElementById("card1"), player1);
  checkWinner(document.getElementById("card2"), player2);
  checkWinner(document.getElementById("card3"), player3);
  checkWinner(document.getElementById("card4"), player4);

  switch (winnersList.length) {
    case 0:
      break;
    case 1:
      let n = 0;
      switch (winnersList[0]) {
        case player1.name:
          n = 1;
          break;
        case player2.name:
          n = 2;
          break;
        case player3.name:
          n = 3;
          break;
        case player4.name:
          n = 4;
          break;
      }
      showSlides(n);
      message = "Ha ganado: "+winnersList[0];
      showWinners(message);
      break;
    default:
      message = "Queee?! ganaron al mismo tiempo: ";
      for (var i = 0; i < winnersList.length; i++) {
        message += " " + winnersList[i] + ", ";
      }
      showWinners(message);
      break;
  }
  if (turn.innerHTML*1 >= maxTurns) {
    gameEnd();
  }
}

function gameEnd() {
  winnersList.push(player1.name);
  let highestScore = player1.score;

  if (player2.score > highestScore) {
    highestScore = player2.score;
    winnersList = [player2.name];
  } else if (player2.score === highestScore) {
    winnersList.push(player2.name);
  }
  if (player3.score > highestScore) {
    highestScore = player3.score;
    winnersList = [player3.name];
  } else if (player3.score === highestScore) {
    winnersList.push(player3.name);
  }
  if (player4.score > highestScore) {
    highestScore = player4.score;
    winnersList = [player4.name];
  } else if (player4.score === highestScore) {
    winnersList.push(player4.name);
  }
  if (winnersList.length > 1) {
    let message = "Han ganado: ";
    for (var i = 0; i < winnersList.length; i++) {
      message += " " + winnersList[i]
      if (i < winnersList.length-1) {
        message += ", ";
      }
    }
  } else {
    message = "Ha ganado: "+winnersList[0];
  }
  showWinners(message);
}

function showWinners(message) {
  let endCard = document.getElementById("end");
  let winner = document.getElementById("winner");
  winner.innerHTML = message;
  endCard.style.display = "flex";
  document.getElementById("ruleta").style.display = "none";

  for (var i = 0; i < winnersList.length; i++) {
    if (localStorage.getItem(winnersList[i]) !== null) {
      console.log('El elemento está en localStorage');
      localStorage.setItem(winnersList[i], localStorage.getItem(winnersList[i])+1);
    } else {
      // El elemento no se encuentra en localStorage
      console.log('El elemento no está en localStorage');
      localStorage.setItem(winnersList[i], 1);
    }
  }

  setTimeout(function(){ window.location.href = "./index.html"; }, 4000);
}

function checkNumbers(card, roll) {
  var rows = card.children;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].children;
    for (var x = 0; x < cells.length; x++) {
      //console.log(cells[x].firstElementChild.innerText + " vs " + roll + " = " + (cells[x].firstElementChild.innerText*1 === roll));
      if (cells[x].firstElementChild.innerText*1 === roll) {
        cells[x].firstElementChild.className = "number-marked"
      }
    }
  }
}

function checkWinner(card, player) {
  if (checkRows(card)>=cardSize) {
    player.score+=5;
    winnersList.push(player.name);
  }
}


function checkPoints(card) {
  rowsScore = checkRows(card);
  colsScore = checkCols(card);
  diagsScore = checkDiags(card);
  //console.log("Rows score: "+rowsScore);
  //console.log("Cols score: "+colsScore);
  //console.log("Diags score: "+diagsScore);
  return rowsScore + colsScore + diagsScore;
}

function checkRows(card) {
  var rows = card.children;
  let rowsScore = 0;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].children;
    let auxScore = 1;
    for (var x = 0; x < cells.length; x++) {
      if (cells[x].firstElementChild.className !== "number-marked") {
        auxScore = 0;
      }
    }
    rowsScore += auxScore;
  }
  return rowsScore;
}

function checkCols(card) {
  var rows = card.children;
  let colsScore = 0;
  let auxScore = [];
  for (var i = 0; i < cardSize; i++) {
    auxScore[i] = 1;
  }
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].children;
    for (var x = 0; x < cells.length; x++) {
      if (cells[x].firstElementChild.className !== "number-marked") {
        auxScore[x] = 0;
      }
    }
  }

  for (var i = 0; i < cardSize; i++) {
    colsScore += auxScore[i];
  }

  return colsScore;
}

function checkDiags(card) {
  var rows = card.children;
  let diagsScore = 6;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].children;
    //console.log(cells[i].firstElementChild.innerHTML + " marcado: " + (cells[i].firstElementChild.className === "number-marked"));
    if (cells[i].firstElementChild.className !== "number-marked") {
      diagsScore = 3;
    }
  }
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].children;
    //console.log(cells[(cells.length)-i-1].firstElementChild.innerHTML + " marcado: " + (cells[(cells.length)-i-1].firstElementChild.className === "number-marked"));
    if (cells[(cells.length)-i-1].firstElementChild.className !== "number-marked") {
      switch (diagsScore) {
        case 3:
          diagsScore = 0;
          break;
        case 6:
          diagsScore = 3;
          break;
      }
    }
  }
  return diagsScore;
}

function loadScores() {
  console.log("Loading scores..."	)
  let scores = document.getElementById("scores");
  const claves = Object.keys(localStorage);
  let i = 1;
  claves.forEach((clave) => {
    const valor = localStorage.getItem(clave);

    const elemento = document.createElement('div');
    elemento.className = "score";
    const elementoText = document.createElement('h4');
    elementoText.textContent = `${i}. ${clave}: ${valor}pts.`;
    elemento.appendChild(elementoText);
    scores.appendChild(elemento);
    i++;
  });
}