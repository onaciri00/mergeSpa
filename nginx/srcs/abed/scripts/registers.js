
const form = document.getElementById("form");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const player3 = document.getElementById("player3");
const player4 = document.getElementById("player4");
const player5 = document.getElementById("player5");
const player6 = document.getElementById("player6");
const player7 = document.getElementById("player7");
const player8 = document.getElementById("player8");
const commingUp = document.createElement("div");
commingUp.className = "comingUp";
commingUp.innerHTML = `
	<h1>Next Match</h1>
	<h1 id="announce1">Next Match:</h1>
	<h2> Press enter....<h2>
	`;
let sameName = false;
let bracket = [];
// document.getElementById(".submit").disabled = true;

export function rplayers(){
	let retBracket = bracket;
	bracket = [];
	return retBracket;
}

const handleSubmit = (e) => {
	e.preventDefault();
	validateInput();
}

const hide = (element) => {
	element.style.display = 'none';
}

const show = (element) => {
	console.log("IN prog2");
	element.style.display = 'flex';
	const parent = document.querySelector("#choose-mode");
	parent.append(element);
}

const randomNumber = (i) =>{
	return(Math.floor(Math.random() * i));
}

const fill = (element, pvalue, i, bracket) => {
	let deleter = randomNumber(i);
	console.log("length", i);
	console.log(deleter);
	console.log(pvalue[deleter]);
	document.getElementById(element).value = pvalue[deleter];
	bracket.push(pvalue[deleter]);
	pvalue.splice(deleter,1);
	console.log(pvalue);
}

form.addEventListener('submit', handleSubmit);

const validateInput = () =>{
	
	let pValue = [];
	pValue[0] = player1.value.trim();
	pValue[1] = player2.value.trim();
	pValue[2] = player3.value.trim();
	pValue[3] = player4.value.trim();
	pValue[4] = player5.value.trim();
	pValue[5] = player6.value.trim();
	pValue[6] = player7.value.trim();
	pValue[7] = player8.value.trim();
	let i = 8;
	sameName = false;
	for (let i = 0;i < pValue.length;i++)
	{
		for(let j = i + 1; j < pValue.length; j++)
		{
			if (pValue[i] == pValue[j])
			{
				sameName = true;
				console.log("there");
				console.log(pValue[i]);
				console.log(pValue[j]);
				break;
			}
		}
	}
	if (sameName == true)
	{
		console.log("here");
		// form.addEventListener('submit', handleSubmit);
		alert("same name");
	}
	else
	{
		console.log("IN prog");
		const allbrackets = document.createElement("div");
		commingUp.className = "allbrackets";
		commingUp.innerHTML = `
            <div class="fistbracketss">
                <form id="Match1" class="match-unit">
                    <h2>1st Match</h2>
                    <div class = "input-control">
                        <input id="player1B" name="1st player" type="text" disabled>
                    </div>
                    <div class = "input-control">
                        <input id="player2B" name="2st player" type="text" disabled>
                    </div>
                </form>
                <form id="Match2" class="match-unit">
                    <h2>2nd Match</h2>
                    <div class = "input-control">
                        <input id="player3B" name="3rd player" type="text" disabled>
                    </div>
                    <div class = "input-control">
                        <input id="player4B" name="=4th player" type="text" disabled>
                    </div>
                </form>
                <form id="Match3" class="match-unit">
                    <h2>3rd Match</h2>
                    <div class = "input-control">
                        <input id="player5B" name="5th player" type="text" disabled>
                    </div>
                    <div class = "input-control">
                        <input id="player6B" name="6th player" type="text" disabled>
                    </div>
                </form>
                <form id="Match4" class="match-unit">
                    <h2>4th Match</h2>
                    <div class = "input-control">
                        <input id="player7B" name="7th player" type="text" disabled>
                    </div>
                    <div class = "input-control">
                        <input id="player8B" name="8th player" type="text" disabled>
                    </div>
                </form>
            </div>
            <div class="semifinals">
                <form id="Semi-final1" class="match-unit">
                    <h2>Semi Final</h2>
                    <div class = "input-control">
                        <input id="1stbracket" name="1st Bracket Winner" type="text" disabled>
                    </div>
                    <div class = "input-control">
                        <input id="2ndbracket" name="2nd Bracket Winner" type="text" disabled>
                    </div>
                </form>
                <form id="Semi-final2" class="match-unit">
                    <h2>Semi Final</h2>
                    <div class = "input-control">
                        <input id="3rdbracket" name="3rd Bracket Winner" type="text" disabled>
                    </div>
                    <div class = "input-control">
                        <input id="4thbracket" name="4th Bracket Winner" type="text" disabled>
                    </div>
                </form>
            </div>
            <div class="Finals">
                <form id="Finals" class="match-unit">
                    <h2>Finals</h2>
                    <div class = "input-control">
                        <input id="Finalist1" name="1st Finalist" type="text" disabled>
                    </div>
                    <div class = "input-control">
                        <input id="Finalist2" name="2nd Finalist" type="text" disabled>
                    </div>
                </form>
            </div>
			`;
		hide(document.querySelector('.container'));
		show(document.querySelector('.allbrackets'));
		// show(document.querySelector('.comingUp'));
		commingUp.style.display = "flex";
		const parent = document.querySelector(".allbrackets");
		parent.append(commingUp);
		fill("player1B", pValue, pValue.length, bracket);
		fill("player2B", pValue, pValue.length, bracket);
		// let curr_matach1 = "Blue is " + bracket[0];
		// let curr_matach2 = "Red is " + bracket[1];

		// document.querySelector("#announce1").innerHTML = curr_matach1 + " vs " +  curr_matach2;
		fill("player3B", pValue, pValue.length, bracket);
		fill("player4B", pValue, pValue.length, bracket);
		fill("player5B", pValue, pValue.length, bracket);
		fill("player6B", pValue, pValue.length, bracket);
		fill("player7B", pValue, pValue.length, bracket);
		fill("player8B", pValue, pValue.length, bracket);
		// document.getElementById("submit").disabled = false;
	}
	console.log("brackets=====>");
	console.log(bracket);
	// console.log(pValue);
	// if (p1Value === '')
	// {
	// 	alert("enter1");
	// 	setError(player1, "form must be filled");
	// }
	// else {
	// 	setSuccess(player1);
	// }
	// if (p2Value === ''){
	// 	alert("enter 2");
	// 	setError(player2, "form must be filled");
	// }
	// else
	// 	setSuccess(player2);

	// if (p3Value === '') {
	// 	alert("enter 3");
	// 		setError(player3, "form must be filled");
	// }
	// else
	// 		setSuccess(player3);
	
	// if (p4Value === '')
	// 	setError(player4, "form must be filled");
	// else
	// 	setSuccess(player4);

	// if (p5Value === '')
	// 	setError(player5, "form must be filled");
	// else
	// 	setSuccess(player5);

	// if (p6Value === '')
	// 	setError(player6, "form must be filled");
	// else
	// 	setSuccess(player6);

	// if (p7Value === '')
	// 	setError(player7, "form must be filled");
	// else
	// 	setSuccess(player7);

	// if (p8Value === '' )
	// 	setError(player8, "form must be filled");
	// else
	// 	setSuccess(player8);
}

// const setError = (element, message) => {
// 	const inputControl = element.parentElement;
// 	const errorDisplay = inputControl.querySelector('error');
// 	console.log("error: ", errorDisplay);

// 	errorDisplay.innerText = message;
// 	errorDisplay.classlist.add('error');
// 	errorDisplay.classlist.remove('success');
// }

// const setSuccess = (element) => {
// 	const inputControl = element.parentElement;
// 	const errorDisplay = inputControl.querySelector('.error');
// 	errorDisplay.innerText = '';

// 	errorDisplay.classlist.add('success');
// 	errorDisplay.classlist.remove('error');
// }