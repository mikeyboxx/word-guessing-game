// obtain referneces to DOM elements
var topWordContainerEl = document.getElementById('top-word-container');
var gameMsgEl = document.getElementById('game-msg');
var userCharEl = document.getElementById('user-char');
var startBtnEl = document.getElementById('button');
var timerEl = document.getElementById('timer');

// initialize globals
var randomWord = '';
var topElArr = [];
var guessedCharsArr = [];
var nbrOfGuessedChars = 0;
var winner = false;
var lastIdx = -1;
var timer = {};
var TIMER_SECS = 20;
var timerCountDown = TIMER_SECS;
var MAX_WORD_LENGTH = 5;
var MIN_WORD_LENGTH = 3;
// build the word list from contents of words.js
var wordList = WORDS.split('\n').filter((el)=>el.length >= MIN_WORD_LENGTH && 
                                              el.length <= MAX_WORD_LENGTH);

// Initialize all of the global variables
function initializeGame(){
    // remove all of the generated <p> tags
    while (topWordContainerEl.firstChild) 
        topWordContainerEl.removeChild(topWordContainerEl.firstChild);
    // generate random word
    var n = Math.floor(Math.random()* wordList.length);
    randomWord = wordList[n];
    // generate and style html based on length of word. Store the generated elements in an array.
    topElArr = [];
    for (var i=0; i<randomWord.length; i++){
        var el = document.createElement('p');
        el.textContent = '_';
        el.setAttribute('id',`elT${i}`);
        el.setAttribute('style','font-size: 150px; margin: 15px; flex 0 1;');
        topWordContainerEl.appendChild(el);
       
        el.addEventListener('click', function (){
            return function (obj){
                console.log('click');
                console.log(obj);
                (obj.toggle === 0) ? obj.toggle = 1 : obj.toggle = 0; 
                (obj.toggle === 0) ? this.style.color = 'red' : this.style.color = 'black';
            }.bind(el, { toggle: 1})
        }());
        
        topElArr.push(el);
    }
    // initialize the guessed chars array
    guessedCharsArr = Array(randomWord.length).fill('_');
    nbrOfGuessedChars = 0;
    // initialize globals
    winner = false;    // winner
    lastIdx = -1;      // last index of unguessed char
    topElArr[0].style.color = 'red';       // make the first unguessed char red to prompt user input
    userCharEl.textContent = '';            // clear user input display
    gameMsgEl.textContent = '';            // clear the game message
    timerEl.style.visibility = 'visible';  // display timer
    clearInterval(timer);                  // clear timer
}

// start the timer coundown
function startTimer(){
    timer = setInterval(function (){
        timerCountDown--;
        timerEl.textContent = timerCountDown;
        if (timerCountDown === 1) {
            if (!winner) {
                gameMsgEl.textContent = 'YOU LOSE!!!';
                winner = !winner;
                userCharEl.textContent = randomWord.toUpperCase();
            }
            clearInterval(timer);
        }
    },1000);
}

// click button handler
function buttonClickCallback(event){ 
    event.stopPropagation();
    initializeGame();
    timerEl.textContent = timerCountDown = TIMER_SECS;
    startTimer();
}

// keypress handler
var keypressCallback = function (event){
    var idx;
    event.stopPropagation();

    if (winner) return;      // if winner is determined exit 
    getNextUnguessedChar();  // idx will be set to next unguessed char in guessedCharsArr

    // check if char entered is in the word. If it is then update our array and html
    if (event.key.toUpperCase() === randomWord[idx].toUpperCase()){
        guessedCharsArr[idx] = event.key.toUpperCase();
        topElArr[idx].textContent = event.key.toUpperCase();
        nbrOfGuessedChars++;
    }
    // reset the font color to black  
    topElArr[idx].style.color = 'black';
    // display what user is typing
    userCharEl.textContent = event.key.toUpperCase();
    // if all chars were guessed correctly then set the winner flag 
    if (nbrOfGuessedChars === guessedCharsArr.length){
        gameMsgEl.textContent = 'YOU WIN!!!';
        clearInterval(timer);  // stop the countdown clock
        winner = !winner;
    } else {
        lastIdx = idx;                                   // save the current index of '_' char
        getNextUnguessedChar();
        topElArr[idx].style.color = 'red'; // make the font color red to prompt user
    }
    // find the index of the next '_' character
    // if we reached the end of the word, reset the last index to the begining of the word 
    function getNextUnguessedChar(){
        idx = guessedCharsArr.indexOf('_', lastIdx + 1); 
        if (idx === -1 ) {
            lastIdx = -1;                                    // reset the index 
            idx = guessedCharsArr.indexOf('_', lastIdx + 1); // find the index of the next '_' char again
        } 
    }
}

// add event listeners
document.body.addEventListener('keypress', keypressCallback);
startBtnEl.addEventListener('click', buttonClickCallback);