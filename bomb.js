console.log('loaded!');

// variables 
const STARTING_TIME = 30;
var gameOver = false;
var remainingTime = 0;
var delayHandle = null;
var timerHandle = null;

var wiresToCut = [];
var wiresCut = {
    blue: false,
    green: false,
    red: false,
    white: false,
    yellow: false
}

//declare DOM variables 
var timerText;
var startButton;
var resetButton;
var blue;
var green;
var red;
var white;
var yellow;
var wireBox;

//event listeners 
document.addEventListener('DOMContentLoaded', function (e) {
    timerText = document.getElementById('timertext');
    startButton = document.getElementById('start');
    resetButton = document.getElementById('reset');
    blue = document.getElementById('blue');
    green = document.getElementById('green');
    red = document.getElementById('red');
    white = document.getElementById('white');
    yellow = document.getElementById('yellow');
    wireBox = document.getElementById('wirebox');

    startButton.addEventListener('click', function (e) {
        console.log('clicked start');
        timerHandle = setInterval(updateClock, 1000);
    });
    resetButton.addEventListener('click', function (e) {
        console.log('clicked reset')
        reset();
    });
    wireBox.addEventListener('click', function (e) {
        if (!wiresCut[e.target.id] && !gameOver) {
            //change the image
            e.target.src = "img/cut-" + e.target.id + "-wire.png";
            //mark as cut
            wiresCut[e.target.id] = true;
            //determine if it is correct wire
            var wireIndex = wiresToCut.indexOf(e.target.id)
            if (wireIndex > -1) {
                //correct
                console.log(e.target.id + " was correct");
                wiresToCut.splice(wireIndex, 1);
                //Here we will check for win
                if(checkForWin()){
                    endGame(true);
                }
            } else {
                //incorrect 
                console.log(e.target.id + " was incorrect");
                delayHandle = setTimeout(function () {
                    console.log('bang!');
                    endGame(false);
                }, 750)
            }
        }
    })
})

//functions

function checkForWin(){
    return wiresToCut.length ? false : true;
}

function endGame(win){
    //clear the timers
    clearTimeout(delayHandle);
    clearInterval(timerHandle);
    //change the game to over
    gameOver = true;
    //enable reset button
    resetButton.disabled = false;
    if(win) {
    //win condition
        console.log('you saved the city');
        timerText.classList.remove('red');
        timerText.classList.add('green');
    } else {
    //loss condition 
        console.log('boom');
        document.body.classList.remove('unexploded');
        document.body.classList.add('exploded');
    }
}

function updateClock(){
    remainingTime--;
    if(remainingTime <= 0){
        endGame(false);
    }
    timerText.textContent = "0:00:" + remainingTime;
}

function initGame(){
    wiresToCut.length = 0;
    remainingTime = STARTING_TIME;
    timerText.textContent = "0:00:" + remainingTime;
    for(let wire in wiresCut){
        var rand = Math.random();
        if(rand > 0.5) {
            wiresToCut.push(wire);
        }
    }
    console.log(wiresToCut);
    resetButton.disabled = true;
    startButton.disabled = false;
}

function reset(){
    gameOver = false;
    var wireImages = wireBox.children;
    for(let i = 0; i < wireImages.length; i++){
        wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
    }
    document.body.classList.add('unexploded');
    document.body.classList.remove('exploded');
    timerText.classList.remove('green');
    timerText.classList.add('red');
    clearTimeout(delayHandle);
    clearInterval(timerHandle);
    for(let wire in wiresCut){
        wiresCut[wire] = false;
    }
    initGame();
}