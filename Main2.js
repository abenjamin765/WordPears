// Initialize variables
let roundTimer = 10; // Initial timer value in seconds
let round = 1;
let roundTheme;
let activeWords = [];
let themes = []; // Store loaded themes data

// Function to load JSON data from "themes.json" and start the game
function initializeGame() {
  fetch("themes.json")
    .then((response) => response.json())
    .then((data) => {
      themes = data.Themes;

      // Check if themes are loaded correctly
      if (!themes || themes.length === 0) {
        console.error("No themes found in the JSON file.");
        return;
      }

      startNewRound();
    })
    .catch((error) => console.error(error));
}

// Start a new round
function startNewRound() {
  // Randomly select a theme
  roundTheme = getRandomTheme();

  // Create an empty array called "activeWords"
  activeWords = [];

  // Add 2 words from the "roundTheme" to "activeWords"
  const roundThemeWords = roundTheme.Words;
  activeWords.push(roundThemeWords[0], roundThemeWords[1]);

  // Randomly select 4 additional themes
  for (let i = 0; i < 4; i++) {
    const randomTheme = getRandomTheme();
    const randomWord = getRandomWordInTheme(randomTheme);
    activeWords.push(randomWord);
  }

  // Display round and timer
  updateRoundAndTimer();

  // Create buttons for activeWords and display them in "wordList"
  createWordButtons();
}

// Function to update the round and timer display
function updateRoundAndTimer() {
  document.getElementById("round").value = round;
  document.getElementById("time").value = roundTimer;
}

// Function to create buttons for activeWords
function createWordButtons() {
  const wordListElement = document.getElementById("wordList");
  wordListElement.innerHTML = ""; // Clear existing buttons

  activeWords.forEach((word) => {
    const button = document.createElement("button");
    button.textContent = word;
    button.addEventListener("click", handleWordClick);
    wordListElement.appendChild(button);
  });
}

// Handle word button clicks
let selectionOne = null;
let selectionTwo = null;

function handleWordClick(event) {
  const clickedButton = event.target;

  if (!selectionOne) {
    selectionOne = clickedButton;
    selectionOne.classList.add("selected");
  } else if (!selectionTwo) {
    selectionTwo = clickedButton;
    selectionTwo.classList.add("selected");

    // Check if selections belong to the roundTheme
    if (
      activeWords.includes(selectionOne.textContent) &&
      activeWords.includes(selectionTwo.textContent)
    ) {
      selectionOne.classList.add("correct");
      selectionTwo.classList.add("correct");
      setTimeout(transitionToNextRound, 1000);
    } else {
      setTimeout(() => {
        selectionOne.classList.remove("selected");
        selectionTwo.classList.remove("selected");
        selectionOne = null;
        selectionTwo = null;
      }, 1000);
    }
  }
}

// Function to transition to the next round
function transitionToNextRound() {
  // Ensure roundTheme is defined
  if (!roundTheme) {
    console.error("Round theme is not defined.");
    return;
  }

  // Select a new roundTheme from themes associated with activeWords
  const themeOptions = [];
  activeWords.forEach((word) => {
    if (
      word !== selectionOne.textContent &&
      word !== selectionTwo.textContent
    ) {
      const themeOfWord = findThemeOfWord(word);
      if (themeOfWord && themeOfWord !== roundTheme) {
        themeOptions.push(themeOfWord);
      }
    }
  });

  if (themeOptions.length === 0) {
    console.error("No suitable theme found.");
    return;
  }

  roundTheme = themeOptions[Math.floor(Math.random() * themeOptions.length)];

  // Randomly choose either selectionOne or selectionTwo
  const selectionToReplace = Math.random() < 0.5 ? selectionOne : selectionTwo;

  // Replace the selected word with a new word from the new roundTheme
  const newWord = getRandomWordInTheme(roundTheme);
  selectionToReplace.textContent = newWord;

  // Reset the selected classes
  selectionOne.classList.remove("selected", "correct");
  selectionTwo.classList.remove("selected", "correct");
  selectionOne = null;
  selectionTwo = null;

  // Start the next round
  round++;
  roundTimer = 10;
  updateRoundAndTimer();
}

// Function to find the theme associated with a specific word
function findThemeOfWord(wordToFind) {
  for (const theme of themes) {
    if (theme.Words.includes(wordToFind)) {
      return theme;
    }
  }
  return null; // Theme not found
}

// Function to get a random theme from themes
function getRandomTheme() {
  return themes[Math.floor(Math.random() * themes.length)];
}

// Function to get a random word from a theme
function getRandomWordInTheme(theme) {
  const words = theme.Words;
  return words[Math.floor(Math.random() * words.length)];
}

// Handle game over
function gameOver() {
  alert(`Game Over. The theme was ${roundTheme.Theme}`);
}

// Start the game by loading themes
initializeGame();

// Timer countdown (update every second)
const timerInterval = setInterval(() => {
  roundTimer--;

  if (roundTimer <= 0) {
    clearInterval(timerInterval);
    gameOver();
  } else {
    document.getElementById("time").textContent = roundTimer;
  }
}, 1000);
