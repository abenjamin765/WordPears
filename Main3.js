// Initialize variables
let roundTimer = 10; // Initial timer value in seconds
let round = 1;
let roundTheme;
let activeWords = [];
let themes = []; // Store loaded themes data

// Setup the game
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
      // Set timer
      document.getElementById("round").value = round;
      document.getElementById("time").value = roundTimer;

      // Start a new round
      startNewRound();
    })
    .catch((error) => console.error(error));
}

// Start a new round
function startNewRound() {
  roundTheme = pickRoundTheme();
  generateButtons();
  console.log("You did it!");
}

// Generate buttons
function generateButtons() {
  const wordList = document.getElementById("wordList");
  wordList.innerHTML = ""; // Clear existing buttons

  activeWords.forEach((word) => {
    const button = document.createElement("button");
    button.textContent = word;
    button.addEventListener("click", handleWordClick);
    wordListElement.appendChild(button);
  });
}

// End the game
function gameOver() {
  alert(`Game Over. The theme was ${roundTheme.Theme}`);
}

// Start the game
initializeGame();
