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
