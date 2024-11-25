import { rplayers } from "./registers.js";

var socket = null;

document.addEventListener("DOMContentLoaded", () =>  {
	
	const canvas = document.getElementById('canvas');
	canvas.width = 600; 
	canvas.height = 300;
	const ctx = canvas.getContext('2d');
	const img = new Image();
	img.src = "./img2.jpg";
	let semi = [];
	let final = [];
	let bracket;
	let pmatch = 0;
	let isTourn = false;
	let gameStart = false;
	let noMatch = false;
	let ballPosition = { x: 400, y: 200 }; 
	let ballRadius = 10;
	let paddle1 = {
        x: 10,        
        y: 110,       
        w: 5,        
        h: 80,        
    };
	let paddle2 = {
        x: 10,        
        y: 110,       
        w: 5,        
        h: 80,        
    };
	/*******************************************************************************************************/
	//																	My change
	/*******************************************************************************************************/
	const startContainer = document.createElement("div");
	const waitContainer = document.createElement("div");
	const app = document.getElementById('pingpong-game');
	const main_counter = document.getElementById("main_counter");
	const gameContainer = document.getElementById("game-container1")
	const game_over = document.getElementById("game_over"); 
	//newwwwwwwwwwwwwwwww 
	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.classList.add("btn-close");
	closeBtn.ariaLabel = "Close";
	const bodyElement = document.querySelector("body");
	const header = document.createElement("h1");
	header.id = "header-mode";
	header.innerHTML = `CHOOSE MODE`;
	const parent = document.createElement("div");
	const container = document.createElement("div");
	container.id = "cont-modes";
	parent.id = "choose-mode";
	const twoPlayers = document.createElement("div");
	twoPlayers.id = "two-players";
	twoPlayers.classList.add("mode");
	twoPlayers.innerHTML = `Two Players.`
	const tournament = document.createElement("div");
	tournament.id = "tournament";
	tournament.classList.add("mode");
	tournament.innerHTML = `Tournament.`;
	const remote = document.createElement("div");
	remote.id = "remote";
	remote.classList.add("mode");
	remote.innerHTML = `Remote.`
	container.append(twoPlayers, tournament, remote);
	parent.append(header, container);
	bodyElement.append(parent);
	parent.append(header, container, closeBtn);

	startContainer.className = "start-container1";
	waitContainer.className = "wait-container1";
	let gameType;
	let roomCode;
	let room_is_created = false;
	let pad_num;

	startContainer.innerHTML = `
	<h1>Welcome to PONG</h1>
	<button class="select" id="startGame1">Start a Game</button>
	`;

	waitContainer.innerHTML=`
	<div class="loader-container1">
		<div class="loading-text1">Loading<span class="dots1"></span></div>
	</div>
	`;

	
	app.appendChild(startContainer);
	app.appendChild(waitContainer);
	app.append(game_over);
	document.getElementById("startGame1").addEventListener("click", function() {
		
		wait_page();
		if (gameType == 'remote')
			fetchRoom();
		else
			createRoom();
	});

	window.addEventListener("beforeunload", (event) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			console.log("in closed");
			socket.send(JSON.stringify({ type: "close" }));
		}
	});
	function createRoom() {
		fetch('http://127.0.0.1:8002/api/prooms/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"code": generateRoomCode(),
				"type": gameType
			})
		})
	    .then(response => response.json())
	    .then(data => {
	        roomCode = data.code;
	        console.log("Created new room with code: ", roomCode); 
	        wait_page();
	        connectWebSocket();
	    })
	    .catch(error => {
	        console.error("Error creating room:", error);
	    });
	}

	function disconnect()
	{
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.close();
		}
	}

	function fetchRoom() {
	    fetch('http://127.0.0.1:8002/api/prooms/')
	    .then(response => {
	        if (!response.ok) {
	            console.log("No available rooms, creating a new room...");
	            createRoom();
	            room_is_created = true;
	            console.log("room was created");
	        }
	        console.log("we are about to return ");
	        return response.json();
	    })
	        .then(data => {
	            if (data && !room_is_created) {
	                const room = data;
	                console.log("the room is ", room.code, " and num of player ", room.players);
	                if (room.players < 2) {
	                    console.log("********************************inside room num ", room.code, " and num of player ", room.players);
	                    roomCode = room.code;  
	                    console.log("Joining existing room with code: ", roomCode); 
	                    wait_page();
	                    connectWebSocket();
	                    return ;
	                }
	                else {
	                    console.log("Room is full, creating a new room...");
	                    createRoom();  
	                }
	            }
	        }) 
	        .catch(error => {
	            console.error("Error fetching rooms:", error);
	        });
	}

	function connectWebSocket() {
		socket = new WebSocket(`ws://127.0.0.1:8002/ws/playp/${roomCode}/`);

		socket.onopen = function() {
			console.log('WebSocket connection established.');
			if (gameType == "local" || gameType == "tourn")
			{
				socket.send(JSON.stringify({ type: "local" }));
			}
		};
		socket.onmessage = function(event) {
			const data = JSON.parse(event.data);
			if (data.type === "GAME_STATE") {
				const ball = data.ball				
				const paddle_serv1 = data.paddle1;
				const paddle_serv2 = data.paddle2;
				ballPosition.x = ball.x;
				ballPosition.y = ball.y;
				ballRadius = 10;
				paddle1.x = paddle_serv1.x;
				paddle1.y = paddle_serv1.y;
				paddle2.x = paddle_serv2.x;
				paddle2.y = paddle_serv2.y;
				document.getElementById("player1Score").innerHTML = paddle_serv1.score;
				document.getElementById("player2Score").innerHTML = paddle_serv2.score;
				renderGame();
			}
			else if (data.type === 'ASSIGN_PAD_NUM') {
				console.log("in PadNum");
				pad_num = data.pad_num;
				console.log("pad num is ", pad_num)
			}
			else if (data.event == 'START')
				{
					console.log("in start");
					start_game();
				}
			else if (data.event == 'END')
				Game_over(data.message);
			else if (data.event == "LEFT" && gameType == "remote"){
				noMatch = true;
				left_game(data.pad_num);
			}

		};
	}
	

	function wait_page()
	{
	    console.log("wait fuction");
	    waitContainer.classList.add("active");
	    startContainer.classList.remove("active");
	    startContainer.style.display = "none";
	}


	function start_game(){
		console.log("start")
		console.log("tourn mod");
        startContainer.classList.remove("active");
		waitContainer.classList.remove("active");
		main_counter.style.display = "block";
		let Tournament = document.querySelector('.allbrackets');
		Tournament.style.display = "none";
		resetDOM()
		runAnimation();
		setTimeout(() => {
			socket.send(JSON.stringify({ type: "start"}));
			if (!noMatch)
				gameContainer.style.display = "block";
			renderGame();
			
		}, 3500)
		gameStart = true;

	}

	function playTournemt(){
		console.log("this bracket have ", bracket);
		console.log("this semi bracket have ", semi);
		console.log("pmatch  is ", pmatch)
		if (pmatch < 4 ){
			createRoom();
			app.style.display = "flex";
			startContainer.classList.remove("active");
			startContainer.style.display = "none";
			pmatch += 1;
		}
		else if (pmatch < 6 && pmatch > 3){
			createRoom();
			app.style.display = "flex";
			startContainer.classList.remove("active");
			startContainer.style.display = "none";
			pmatch += 1;
		}
		else{
			createRoom();
			app.style.display = "flex";
			startContainer.classList.remove("active");
			startContainer.style.display = "none";
			pmatch += 1;

		}
	}
	function update_tournment(){
		console.log("this is working ...");
		app.style.display = "none";
		let Tournament = document.querySelector('.allbrackets');
		Tournament.style.display = "flex";
		let curr_matach1 = " Blue is " + bracket[0];
		let curr_matach2 = " Red is " + bracket[1];

		document.querySelector("#announce1").innerHTML = curr_matach1 + " vs ";
		document.querySelector("#announce2").innerHTML = curr_matach2;
		// update player 
	}


	function Game_over(winner)
	{
		console.log("Winer Is pad ", winner)
		disconnect();
		if (gameType == 'tourn')
		{
			console.log("Tourn End");
			if (!isTourn)
			{
				//4 matches quarter end 6 matche semi end 7 matches end
				// always remove first two from bracket and then semi 
				// function to keep count and start matche first call is by enter key
				//winner taker pad num 
				if (pmatch <= 4)
				{
					if (winner == '0')
					{
						semi.push(bracket[0]);
					}
					else{
						semi.push(bracket[1]);
					}
					console.log("semi lent ", semi.length, "semi elemnt ", semi);
					if (semi.length == 1)
						document.getElementById("1stbracket").value = semi[0];
					else if (semi.length == 2) 
						document.getElementById("2ndbracket").value = semi[1];
					else if (semi.length == 3)
						document.getElementById("3rdbracket").value = semi[2];
					else if (semi.length == 4)
						document.getElementById("4thbracket").value = semi[3];
					if (bracket.length - 2 > 0)
						bracket.splice(0, 2);
				}
				else if (pmatch <= 6 && pmatch > 4){
					if (winner == '0')
						final.push(semi[0]);
					else
						final.push(semi[1]);
					if (final.length == 1)
						document.getElementById("Finalist1").value = final[0];
					else if (final.length == 2)
						document.getElementById("Finalist2").value = final[1];
					semi.splice(0, 2);
				}
				if (pmatch == 7)
				{
					console.log("Game over ")
					if (winner == '0')
						console.log(" the winner is ", final[0])
					else
						isTourn = true;
					console.log(" the winner is ", final[1])
					// announce Winner and pmatch = 0 and game start
					//anounceWiner();
				}
				update_tournment();
			}
		}

		else if (gameType == "remote")
		{

			if (pad_num == parseInt(winner))
			{
				gameContainer.style.display = "none";
				game_over.style.display = "block";
				if (pad_num == 0)
					game_over.style.backgroundColor = "#0095DD";
			}
			else
			{
				gameContainer.style.display = "none";
				game_over.style.display = "block";
				document.getElementById("result1").innerHTML = "You lose";
				if (pad_num == 0)
					game_over.style.backgroundColor = "#0095DD";
			}
			document.querySelector("#play-again").style.display = "block";
		}
		else 
		{
			if (0 == parseInt(winner))
				{
					gameContainer.style.display = "none";
					game_over.style.display = "block";
					game_over.style.backgroundColor = "#0095DD";
					document.getElementById("result1").innerHTML = "Blue  Won";
				}
				else
				{
					gameContainer.style.display = "none";
					game_over.style.display = "block";
					document.getElementById("result1").innerHTML = "Red  Won";

				}
				document.querySelector("#play-again").style.display = "block";
		}
	}

	function left_game(left_pad)
	{
		if (left_pad == pad_num){
			console.log("you lose");
		}
		else
		{
			if (left_pad == 0){
				Game_over(1);
			}
			else{
				Game_over(0);
			}
		}
	}



	function generateRoomCode() {
	    return Math.random().toString(36).substring(2, 8).toUpperCase();
	}

	const nums = document.querySelectorAll('.nums span');
	const counter = document.querySelector('.counter');
	const repl = document.getElementById('replay');


	function resetDOM() {
		counter.classList.remove('hide');
	
		nums.forEach(num => {
			num.classList.value = '';
		});

	    nums[0].classList.add('in');
	}

	function runAnimation() {
		nums.forEach((num, idx) => {
			const penultimate = nums.length - 1;
			num.addEventListener('animationend', (e) => {
				if(e.animationName === 'goIn' && idx !== penultimate){
					num.classList.remove('in');
					num.classList.add('out');
				} else if (e.animationName === 'goOut' && num.nextElementSibling){
					num.nextElementSibling.classList.add('in');
				} else {
					counter.classList.add('hide');
				}
			});
		});

	}

	document.addEventListener("keydown", (event) => {
		if (gameType == 'remote'){
			if (gameStart && (event.key === "ArrowUp")) {
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Up", 
					pad_num: pad_num 
				}));
			} 
			else if (gameStart && (event.key === "ArrowDown"))
			{
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Down", 
					pad_num: pad_num 
				}));
			}
		}
		else
		{
			if (gameStart && (event.key === "ArrowUp")) {
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Up", 
					pad_num: 0 
				}));
			}
			else if (gameStart && (event.key === "ArrowDown"))
			{
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Down", 
					pad_num: 0 
				}));
			}
			if (gameStart && (event.key === "w" || event.key === "W")) {
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Up", 
					pad_num: 1 
				}));
			}
			else if (gameStart && (event.key === "s" || event.key === "S"))
			{
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Down", 
					pad_num: 1 
				}));
			}

		}
	});
	
	document.addEventListener("keyup", (event) => {
		if (gameType == "remote")
		{
			if (gameStart && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Stop", 
					pad_num: pad_num
				}));
			}
		}
		else
		{
			if (gameStart && (event.key === "ArrowUp" || event.key === "ArrowDown")) 
			{
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Stop", 
					pad_num: 0
				}));
			}
			else if (gameStart && (event.key === "w" || event.key === "W" || event.key === "s" || event.key === "S" ))
			{
				socket.send(JSON.stringify({ 
					type: "move", 
					move: "Stop", 
					pad_num: 1
				}));
			}
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			if (Array.isArray(bracket) && !bracket.length)
				bracket = rplayers();
			if (Array.isArray(bracket) && bracket.length) 
			{
				console.log("successfully!");
				if (!isTourn)
					playTournemt();
			} 
			else 
			{
				console.log("denied.");
			}
		}
	});


	function renderGame() {
		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	
		// Draw the paddle
		ctx.fillStyle = "#ff0000";
		ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
		ctx.fillStyle = "#0095DD";
		ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
	
		// Draw the ball
		ctx.beginPath();
		ctx.arc(ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
		ctx.stroke();
	
		// Request the next frame
		requestAnimationFrame(renderGame);
	}
	/* ************************************ Abed Changes ******************************************* */
	
	const handlePlayBtn = () => {

		// --------------------------------- //
		parent.append(header, container);
		bodyElement.append(parent);
		parent.append(header, container, closeBtn);
		header.style.display = "flex";
		container.style.display = "flex";
		parent.style.display = "flex";
		const handleRemoteGame = () => {
			gameType = 'remote';
			container.style.display = "none";
			header.style.display = "none";
			parent.append(app);
			app.style.display = "flex";
			startContainer.classList.add("active");
			startContainer.style.display = "block";
		}

		remote.addEventListener("click", handleRemoteGame);
		const handleTournament = () => {
			gameType = 'tourn';
			const TournamentContainer = document.querySelector('.container');
			container.style.display = "none";
			header.style.display = "none";
			TournamentContainer.style.display = "flex";
			parent.append(TournamentContainer);
			console.log("This is Workng");
			bracket = rplayers();
			container.style.display = "none";
			header.style.display = "none";
			parent.append(app);
			console.log("this is bracker", bracket);
		}
		tournament.addEventListener("click", handleTournament);

		const handleLocaleGame = () => {
			gameType = 'local';
			console.log("Local");
			container.style.display = "none";
			header.style.display = "none";
			parent.append(app);
			app.style.display = "flex";
			
			startContainer.classList.add("active");
			startContainer.style.display = "block";
		}
		twoPlayers.addEventListener("click", handleLocaleGame);
		const closeGame = () => {
			parent.style.display = "none";
			startContainer.classList.remove("active");
			startContainer.style.display = "none";
			gameType = "";
			app.style.display = "none";
			counter.classList.add('hide');
	
			nums.forEach(num => {
				num.classList.value = '';
			});
	
			nums[0].classList.add('out');
			// const TournamentContainer2 = document.querySelector('.allbrackets');
			// TournamentContainer2.style.display = "none";
			// const parent = document.querySelector("#choose-mode");
			// parent.append(TournamentContainer2);
			playAgain();
		}

		closeBtn.addEventListener("click", closeGame);
	}

	const playAgain = () =>{
		disconnect();
		document.querySelector("#play-again").style.display = "none";
		roomCode = "";
		room_is_created = false;
		pad_num = 0;
		semi = [];
		final = [];
		bracket = [];
		pmatch = 0;
		game_over.style.display = "none";
		gameContainer.style.display = "none";
		startContainer.classList.add("active");
	    startContainer.style.display = "block";
		const TournamentContainer = document.querySelector('.container');
		TournamentContainer.style.display = "none";
		document.querySelector(".comingUp").style.display = "none";
		document.querySelector(".allbrackets").style.display = "none";

	}

    document.querySelector("#play-again").addEventListener("click", playAgain);
	const play_button = document.querySelector("#play-button");
	play_button.addEventListener("click", handlePlayBtn);

});
