// Constants
const ROUND_TIMER_DURATION = 10;
let roundTimer = ROUND_TIMER_DURATION;
let intervalId;
let roundNumber = 1;
let roundThemeId;
let activeWords = [];
let selections = [];
const NUMBER_OF_SELECTIONS_TO_MAKE = 2;

// Initialize the game
async function initializeGame() {
    try {
        await setupRound(roundNumber);
        startTimer();
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

// Set up the round
async function setupRound(roundNumber) {
    try {
        const { theme, words } = await fetchWords(roundNumber);
        roundThemeId = theme;

        if (words.length <= NUMBER_OF_SELECTIONS_TO_MAKE) {
            throw new Error('Insufficient words for selection');
        }

        activeWords = words;
        displayWords();
    } catch (error) {
        console.error('Error setting up round:', error);
    }
}

// Display words on the UI
function displayWords() {
    const wordListElem = document.getElementById("wordList");
    wordListElem.innerHTML = "";
    activeWords.forEach(word => {
        const btn = createWordButton(word);
        wordListElem.appendChild(btn);
    });
}

// Create a word button
function createWordButton(word) {
    const btn = document.createElement("button");
    btn.innerText = word;
    btn.addEventListener("click", selectWord);
    return btn;
}

// Handle word selection
function selectWord(event) {
    const button = event.target;
    toggleSelection(button);
    updateSelections(button);

    if (areSelectionsComplete()) {
        validateSelection();
    } else if (areSelectionsExceeded()) {
        showSelectionError();
    }
}

function toggleSelection(button) {
    button.classList.toggle("selected");
}

function updateSelections(button) {
    const isSelected = button.classList.contains("selected");
    if (isSelected) {
        selections.push(button);
    } else {
        removeSelection(button);
    }
}

function areSelectionsComplete() {
    return selections.length === NUMBER_OF_SELECTIONS_TO_MAKE;
}

function areSelectionsExceeded() {
    return selections.length > NUMBER_OF_SELECTIONS_TO_MAKE;
}

function showSelectionError() {
    console.error('Too many selections');
}

// Remove a selection
function removeSelection(button) {
    const index = selections.indexOf(button);
    if (index > -1) {
        selections.splice(index, 1);
    }
}

// Validate the selection
async function validateSelection() {
    try {
        const wordsToValidate = selections.map(button => button.innerText);
        const { isCorrect, theme } = await submitAnswer(roundThemeId, wordsToValidate);

        if (isCorrect) {
            selections.forEach(button => button.classList.add("correct"));
            document.getElementById("theme").innerText = theme;
            setTimeout(transitionToNextRound, 1000);
        } else {
            resetSelections();
        }
    } catch (error) {
        console.error('Error validating selection:', error);
    }
}

// Reset selections
function resetSelections() {
    selections.forEach(button => button.classList.remove("selected"));
    selections = [];
}

// Transition to the next round
function transitionToNextRound() {
    // Logic for transitioning to the next round
}

// Start the timer
function startTimer() {
    document.getElementById("time").value = roundTimer;
    intervalId = setInterval(updateTimer, 1000);
}

// Update the timer
function updateTimer() {
    roundTimer--;
    document.getElementById("time").value = roundTimer;
    if (roundTimer === 0) {
        clearInterval(intervalId);
        endGame();
    }
}

// End the game
function endGame() {
    alert(`Game Over. The theme was ${roundThemeId}.`); // Update with actual theme name
}

// Start a new round
function startNewRound() {
    clearInterval(intervalId);
    roundTimer = ROUND_TIMER_DURATION;
    roundNumber++;
    document.getElementById("round").value = roundNumber;
    startTimer();
}

// Initialize the game
initializeGame();
