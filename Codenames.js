let wordList = ["shark", "pencil", "millionaire", "brown", "teacher", "clock", "jungle", "volcano", "carpet", "bicycle", "spoon", "ladder", "balloon", "mailbox", "candle", "wheel", "fountain", "helmet", "cannon", "chimney", "lizard", "compass", "trumpet", "barrel", "magnet", "lantern", "scarecrow", "beaver", "hammock", "cactus", "tornado", "anchor", "goggles", "beehive", "chisel", "cobweb", "kettle", "cliff", "pilot", "lazy", "thunder", "shadow", "thief", "poor", "staircase", "goat", "rotten", "hungry", "mayor", "slippery", "banker", "drive", "concentrate", "forest", "student", "crash", "elephant", "judge", "shallow", "repair", "cousin", "scatter", "honest", "highway", "elbow", "stamp", "grocery", "bitter", "march", "calendar", "farmer", "neighbor", "hammer", "captain", "shiny", "argue", "library", "picnic", "blanket", "scratch", "factory", "muddy", "celebrate", "squirrel", "curtain", "traffic", "jacket", "oven", "soldier", "swim", "restaurant", "whistle", "diamond", "waiter", "cough", "envelope", "ladder", "pillow", "chalk", "truck"]
// Fisher-Yates shuffle
function shuffleAndTake(arr, count) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

//Scores
let gameover = false;
let blueScore = 0;
let redScore = 0;

//[0,1,2,...,24]
let slots = Array.from({length: 25}, (_, i) => i);
let wordI = shuffleAndTake(wordList, slots.length);
// Fisher-Yates shuffle
for (let i = slots.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
}
//Grid layout
let black = slots[0] //first slot
let blanks=  slots.slice(1, 8)   // indices 1-7
let blues =  slots.slice(8, 16)   // indices 8-15
let reds =  slots.slice(16, 25)    // indices 16-24
//Display word buttons
const container = document.getElementById("words");
for (let i = 0; i < wordI.length; i++) {
    const button = document.createElement("button");
    button.textContent = wordI[i];
    if (i === black){
        button.dataset.color = "black";
        //Adds custom data that the button is black
    } else if (blanks.includes(i)){
        button.dataset.color = "blank";
    } else if (blues.includes(i)){
        button.dataset.color = "blue";
    } else if (reds.includes(i)){
        button.dataset.color = "red";
    }
    button.id = "word" + i;
    button.classList.add("word-button");
    button.dataset.reveal = false;
    button.onclick = () => reveal(button);
    button.style.pointerEvents = "none";
    container.appendChild(button);
}

function reveal(button) {
    if(numberG >=1 && button.dataset.reveal === "false") {
        numberG -= 1;
        document.getElementById("cw").innerHTML = codeWord;
        document.getElementById("guesses").innerHTML = numberG;
        if(document.getElementById("toggle").textContent === "Operative" && !gameover) {
            button.dataset.reveal = true;
            button.classList.add(button.dataset.color);
            if (button.dataset.color === "black") {
                document.querySelector(".word-container").style.backgroundColor = "#151515";
                gameover = true;
            } else if (button.dataset.color === "blue") {
                blueScore += 1;
                document.getElementById("blue").textContent = "BLUE " + blueScore;
            } else if (button.dataset.color === "red") {
                redScore += 1;
                document.getElementById("red").textContent = "RED " + redScore;
            }
        }
    }
    if(numberG <=0) {
        setTimeout(() => {
            //Goes through all buttons and removes pointer effects
            const buttons = document.querySelectorAll(".word-button");
            buttons.forEach(button => {
                button.style.pointerEvents = "none";
            });
        }, 300);
    }
}

function toggle(){
    if (document.getElementById("toggle").textContent === "Spymaster"){
        document.getElementById("guesses").textContent = numberG;
        //Go to operative
        if(numberG <=1) {
            //Goes through all buttons and removes pointer effects
            const buttons = document.querySelectorAll(".word-button");
            buttons.forEach(button => {
                button.style.pointerEvents = "none";
            });
        }
        document.getElementById("toggle").textContent="Operative";
        document.getElementById("guess-setup").style.display="none";
    } else if (document.getElementById("toggle").textContent === "Operative"){
        //Go to spymaster
        document.getElementById("toggle").textContent="Spymaster";
        document.getElementById("guess-setup").style.display="block";

    }
    const buttons = container.querySelectorAll(".word-button");
    buttons.forEach(button => {
        //Each button's original color
        const originalColor = button.dataset.color; // Gets stored color

        //If button isn't clicked and it's colored
        if (button.classList.contains(originalColor) && button.dataset.reveal === "false") {
            button.classList.remove(originalColor);
            if(numberG >=1) {
                button.style.pointerEvents = "auto";
            }
        } else {
            button.classList.add(originalColor);
            button.style.pointerEvents = "none";
        }
    });
}


let numberG = 0;
function guess(x){
    if(numberG+x <= 5 && numberG+x >=1){
            document.getElementById("guess-editor").innerHTML = "Number of guesses: " + (numberG+x);
            document.getElementById("up").style.backgroundColor = "#0988ef";
            document.getElementById("down").style.backgroundColor = "#0988ef";
            numberG = numberG + x;
        }
    if(numberG <= 1){
        document.getElementById("down").style.backgroundColor = "#0b50d8";
    } else if (numberG >= 5){
        document.getElementById("up").style.backgroundColor = "#0b50d8";
    }
}
let codeWord = "";
function closeModal(){
    //Reset number of guesses and update
    numberG = 0;
    document.getElementById("guesses").textContent = numberG;
    document.querySelector(".spymaster").style.display = "none";
}

function save() {
    if(numberG <= 0){
        numberG = 1;
    }
    codeWord = document.getElementById("code-word").value //get code word from input text
    document.getElementById("code-word").innerHTML = ""; //clear input text
    document.getElementById("cw").innerHTML = codeWord; //update code word
    document.getElementById("guesses").textContent = numberG; // update number of guesses
    document.querySelector(".spymaster").style.display = "none";
}

function openModal(){
    numberG = 1;
    document.getElementById("down").style.backgroundColor = "#0b50d8";
    document.getElementById("guess-editor").innerHTML = "Number of guesses: " + numberG;
    document.querySelector(".spymaster").style.display = "block";
}
