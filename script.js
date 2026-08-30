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

