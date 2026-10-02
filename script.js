const playField = document.querySelector("#playField");
const wordLayer = document.querySelector("#wordLayer");
const typeInput = document.querySelector("#typeInput");

const scoreDisplay = document.querySelector("#scoreDisplay");
const livesDisplay = document.querySelector("#livesDisplay");
const streakDisplay = document.querySelector("#streakDisplay");
const speedDisplay = document.querySelector("#speedDisplay");
const wpmDisplay = document.querySelector("#wpmDisplay");
const roundMessage = document.querySelector("#roundMessage");

const startOverlay = document.querySelector("#startOverlay");
const gameOverOverlay = document.querySelector("#gameOverOverlay");
const finalScoreEl = document.querySelector("#finalScore");

const wordQueue = [
    "hackclub",
    "macondo",
    "arcade",
    "button",
    "player",
    "ticket",
    "cabinet",
    "score",
    "combo",
    "timer",
    "typing",
    "letter",
    "screen",
    "window",
    "pixel",
    "quarter",
    "bonus",
    "insert",
    "credit",
    "level",
    "target",
    "keyboard",
    "signal",
    "rapid"
];

const game = {
    running: false,
    score: 0,
    lives: 3,
    streak: 0,
    speed: 1,
    elapsedTime: 0,
    lastFrame: 0,
    spawnTimer: 0,
    spawnDelay: 1400,
    wordId: 0,
    typedCharacters: 0,
    activeWords: []
};



let typedInput = "";

function renderTypedInput() {
    typeInput.textContent = typedInput || "start typing...";
    typeInput.classList.toggle("is-empty", !typedInput);
}

function writeTypedInput(value) {
    typedInput = value;
    if("value" in typeInput) typeInput.value = value;
    renderTypedInput();
}

function handleTypingKey(event) {
    if(!game.running) return false;
    if(event.key === "Backspace") {
        writeTypedInput(typedInput.slice(0, -1));
        handleTyping();
        return true;
    }
    if(event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
        writeTypedInput(typedInput + event.key.toLowerCase());
        handleTyping();
        return true;
    }
    return false;
}

function resetState() {
    game.score = 0;
    game.lives = 3;
    game.streak = 0;
    game.speed = 1;
    game.elapsedTime = 0;
    game.lastFrame = 0;
    game.spawnTimer = 0;
    game.spawnDelay = 1400;
    game.wordId = 0;
    game.typedCharacters = 0;
    game.activeWords = [];

    writeTypedInput("");
    typeInput.classList.remove("input-error");
    wordLayer.innerHTML ="";

    updateDashboard();
}

function startGame() {

    resetState();
    game.running = true;
    startOverlay.classList.add("hidden");
    gameOverOverlay.classList.add("hidden");
    roundMessage.textContent = "Running";

    requestAnimationFrame(gameLoop);
}
    
function endGame() {

    game.running = false;
    roundMessage.textContent = "Game Over";
    finalScoreEl.textContent = `Score: ${game.score} · WPM: ${calculateWpm()}`;

    gameOverOverlay.classList.remove("hidden");
}

function updateDashboard() {

    scoreDisplay.textContent = game.score;
    livesDisplay.textContent = game.lives;

    streakDisplay.textContent = game.streak;
    speedDisplay.textContent = `${game.speed.toFixed(1)}x`;
    wpmDisplay.textContent = calculateWpm();
}

function calculateWpm() {

    if(game.elapsedTime < 1000) {
        return 0;
    }

    const minutes = game.elapsedTime / 60000;
    return Math.round((game.typedCharacters / 5) / minutes);
}

function gameLoop(timestamp) {

    if(!game.running) {
        return;
    }

    if(!game.lastFrame) {
        game.lastFrame = timestamp;
    }

    const delta = timestamp - game.lastFrame;
    game.lastFrame = timestamp;

    update(delta);
    render();
    requestAnimationFrame(gameLoop);
}

function update(delta) {
    game.elapsedTime += delta;
    game.spawnTimer += delta;
    
    if(game.spawnTimer >= game.spawnDelay) {
        game.spawnTimer = 0;
        spawnWord();
    }
    moveWords(delta);
    checkDangerLine();
}

function render() {
    updateDashboard();
}

function spawnWord() {

    const text = pickWord();
    const fieldWidth = playField.clientWidth;
    const blockWidth = Math.max(80, text.length * 14 + 28);
    const x = getSpawnX(fieldWidth, blockWidth);

    const element = document.createElement("div");
    element.className = "word-block";
    element.textContent = text;

    wordLayer.appendChild(element);

    const word = {
        id: game.wordId,
        text,
        x,
        y: -40,
        speed: 45 + Math.random() * 18, 
        element
    };

    game.wordId += 1;
    game.activeWords.push(word);

}

function moveWords(delta) {

    for(const word of game.activeWords) {

        word.y += (word.speed * delta) / 1000;
        word.element.style.transform = `translate(${word.x}px, ${word.y}px)`;
    }
}

function checkDangerLine() {

    const dangerY = playField.clientHeight - 52;
    const breached = game.activeWords.filter((word) => word.y >= dangerY);

    for(const word of breached) {

        word.element.remove();
        game.lives = Math.max(0, game.lives - 1);
        game.streak = 0;

    }
    
    game.activeWords = game.activeWords.filter((word) => word.y < dangerY);

    if(game.lives <= 0) {
        endGame();
    }
}

function handleTyping() {

    if(!game.running) {
        return;
    }

    const typed = typedInput;
    typeInput.classList.toggle("input-error", typed.length > 0 && ! hasAnyPrefix(typed));
    refreshWordHighlights();

    if(!typed) {
        return;
    }
    
    const match = game.activeWords.find((word) => word.text === typed);

    if(match) {
        removeWord(match);
        writeTypedInput("");
        typeInput.classList.remove("input-error");
        refreshWordHighlights();
    }

}

function hasAnyPrefix(typed) {

    return game.activeWords.some((word) => word.text.startsWith(typed));
}

function refreshWordHighlights() {

    const typed = typedInput;

    for(const word of game.activeWords) {

        word.element.classList.toggle("targeted", typed.length > 0 && word.text.startsWith(typed));
        word.element.innerHTML = renderTypedLetters(word.text, typed);
    }
}

function renderTypedLetters(word, typed) {

    let html = "";

    for(let i=0; i<word.length; i+=1) {
        const letter = word[i];

        if(i < typed.length && typed[i] === letter) {
            html += `<span class="correct-letter">${letter}</span>`;
        }
        
        else if(i<typed.length) {
            html += `<span class="wrong-letter">${letter}</span>`;
        }

        else{
            html += letter;
        }
    }
    return html;
}

function removeWord(word) {

    word.element.remove();
    game.activeWords = game.activeWords.filter((item) => item.id !== word.id);

    game.streak += 1;
    game.typedCharacters += word.text.length;
    game.score += 100 + game.streak * 10;

    if(game.streak % 5 === 0) {

        game.speed = Math.min(3.0, parseFloat((game.speed + 0.2).toFixed(1)));
        game.spawnDelay = Math.max(600, game.spawnDelay - 100);
    }

}

function pickWord() {

    const index = Math.floor(Math.random() * wordQueue.length);
    return wordQueue[index];
}

function getSpawnX(fieldWidth, blockWidth) {
    const padding = 10;
    const maxX = Math.max(padding, fieldWidth - blockWidth - padding);
    return padding + Math.random() * (maxX - padding);
}


function handleGlobalKeydown(event) {
    if(event.key === "Tab") {
        event.preventDefault();
        return;
    }
    if(event.key === "Enter") {
        if(!game.running) startGame();
        event.preventDefault();
        return;
    }
    if(handleTypingKey(event)) event.preventDefault();
}

document.addEventListener("keydown", handleGlobalKeydown);

updateDashboard();
