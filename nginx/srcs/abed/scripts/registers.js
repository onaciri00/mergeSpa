
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
	<h1>Next Match: </h1>
	<div class="announce">
		<h1 id="announce1">Next Match:</h1>
		<h1 id="announce2">Next Match:</h1>
	</div>
	<div class="pressEnter">
		<h2> Press enter....<h2>
	</div>
	`;
let sameName = false;
let bracket = [];
let retBracket = [];
// document.getElementById(".submit").disabled = true;

export function rplayers(){
	retBracket = bracket;
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
	document.getElementById("1stbracket").value = "";
	document.getElementById("2ndbracket").value = "";
	document.getElementById("3rdbracket").value = "";
	document.getElementById("4thbracket").value = "";
	document.getElementById("Finalist1").value = "";
	document.getElementById("Finalist2").value = "";
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
		commingUp.style.display = "flex";
		const parent = document.querySelector("#choose-mode");
		parent.append(commingUp);
		console.log("IN prog");
		hide(document.querySelector('.container'));
		show(document.querySelector('.allbrackets'));
		// show(document.querySelector('.comingUp'));
		fill("player1B", pValue, pValue.length, bracket);
		fill("player2B", pValue, pValue.length, bracket);
		let curr_matach1 = " Blue is " + bracket[0];
		let curr_matach2 = " Red is " + bracket[1];

		document.querySelector("#announce1").innerHTML = curr_matach1 + " vs ";
		document.querySelector("#announce2").innerHTML = curr_matach2;
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