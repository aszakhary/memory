
var freeze = false, cardsInput, playerInput, playerList, startButton, board, pairCount, cards, cardMap, firstTurned, playerMap, currentPlayer, pairsFound,
	colors = [
		"indianRed",
		"orange",
		"blueViolet",
		"green",
		"cadetBlue",
		"steelBlue",
		"wheat",
		"rosyBrown",
		"goldenRod",
		"sandyBrown",
		"saddleBrown",
		"maroon",
		"navajoWhite",
		"navy",
		"turquoise",
		"cyan",
		"darkOliveGreen",
		"darkCyan",
		"chartreuse",
		"limeGreen",
		"magenta",
		"lavender",
		"yellow",
		"tomato",
		"mediumVioletRed",
		"red",
		"darkRed",
		"silver",
		"darkSlateGray"
	],
	urls = [
		"rdash.png",
		"belle.png",
		"mavis.png",
		"tikki.png",
		"simba.png",
		"nahal.png",
		"olive.png",
		"maleficent.png",
		"hades.png",
		"olaf.png",
		"rapnunzel.png",
		"thomas.png"
	]

function initApplication() {
	cardsInput = document.getElementById("cards");
	playerInput = document.getElementById("players");
	startButton = document.getElementById("start");
	playerList = document.getElementById("playerList");
	startButton.addEventListener("click", function() {
		buildGame(cardsInput.value, playerInput.value);
	});
}

function buildGame(cards, players) {

	if (!cards || !players) console.error("Need inputs!");
	else if (isNaN(cards) || isNaN(players)) console.error("Players and cards must be numbers!");
	else if (players < 1 || players > 5) console.error("Need between 1 and 5 players");
	else if (cards < 1) console.error("Need at least one pair to play.");
	else {	
		total = cards * 2;
		initializeCards(total);
		assignCards(total);
		initializePlayers(players);
	}
}

function getBoard() {
	if (!board) {
		board = document.getElementById("board");
	}
	return board;
}

function initializePlayers(players) {
	var player, name, score;
	playerMap = new Array(players);
	playerList.innerHTML = "";
	for (var i = 0; i < players; i++) {
		playerMap[i] = createPlayer(i+1);
		player = document.createElement("div");
		name = document.createElement("div");
		name.id = "name-" + (i+1);
		name.innerText = playerMap[i].name;
		name.addEventListener("dblclick", changeName);
		score = document.createElement("div");	
		score.id = "score-" + (i+1);
		score.innerText = "Score: 0";
		player.id = i+1;
		player.classList.add("player");
		player.appendChild(name);
		player.appendChild(score);
		playerList.appendChild(player);
	}
	currentPlayer = playerMap[0];
	updatePlayerUI();
}

function changeName() {
	var id, newName = prompt("What is your name?");
	id = this.id.substr(5);
	playerMap[id-1].name = newName;
	this.innerText = newName;
}

function createPlayer(id) {
	var player = {};
	player.id = id;
	player.name = "Player " + id;
	player.score = 0;
	console.log(player);
	return player;
}

function initializeCards(total) {
	pairsFound = 0;
	pairCount = total/2;
	cards = Array.from({ length: pairCount }).fill(2);
	cardMap = [];
}

function assignCards(total) {
	var card, li, cols = Math.round(Math.sqrt(total));
	getBoard().innerHTML = "";
	getBoard().classList = "";
	for (var i = 0; i < total; i++) {
		do {
			card = Math.floor(Math.random() * Math.floor(pairCount));
		} while (cards[card] < 1);		
		cards[card] = cards[card] - 1;
		cardMap[i] = card;
		li = document.createElement("li");
		li.className = "card";
		li.id = i;
		li.addEventListener("click", turnCard);
		getBoard().appendChild(li);
		boardClass = "cols-" + cols;
		getBoard().classList.add(boardClass);
		console.log(total, cols, boardClass);
//		console.log(i + " - " + card);
	}
}

async function turnCard() {
	if (freeze) return;
	this.classList.add("turned");
	this.innerText = cardMap[this.id];
	this.style.backgroundImage = "url('" + urls[cardMap[this.id]] + "')";
	if (!firstTurned) {
		firstTurned = this;		
		return;
	} 
	if (firstTurned.id === this.id) {
		console.log("same card!");
		return;
	}	
	freeze = true;
	if (cardMap[firstTurned.id] === cardMap[this.id]) {
		this.classList.add("won");
		firstTurned.classList.add("won");
		currentPlayer.score = currentPlayer.score + 1;
		document.getElementById("score-"+currentPlayer.id).innerText = "Score: " + currentPlayer.score;
		++pairsFound;
		if (pairsFound === pairCount) {
			gameOver();
		}
		freeze = false;
	} else {
		await new Promise(r => setTimeout(r, 1000));
		freeze = false;
		this.classList.remove("turned");
		this.innerText = "";
		this.style.backgroundImage = "none";
		firstTurned.classList.remove("turned");
		firstTurned.innerText = "";
		firstTurned.style.backgroundImage = "none";
		nextPlayer();
	}
	firstTurned = null;
}

function nextPlayer() {
	if (currentPlayer.id === playerMap.length) {
		currentPlayer = playerMap[0];
	} else {
		currentPlayer = playerMap[currentPlayer.id];
	}
	updatePlayerUI();
}

function updatePlayerUI() {
	document.getElementById("player").innerText = currentPlayer.name + " is playing.";
}

function gameOver() {
	var max = -1, winners = [], message = "Game Over. ";
	board.innerHTML = "";
	for (var i=0; i<playerMap.length; i++) {
		if (playerMap[i].score > max) {
			max = playerMap[i].score;
			winners = [];
			winners.push(playerMap[i].name);
		} else if (playerMap[i].score === max) {
			winners.push(playerMap[i].name);
		}		
	}
	if (winners.length === 1) {
		message = message + winners[0] + " wins!";
	} else {
		message = message + winners.join(", ") + " tied!";
	}
	document.getElementById("player").innerText = message;

}

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
		initApplication();
    }
});