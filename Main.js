let round = 1; // Track the current round
let roundTheme; // Track the current round's theme
let activeThemes = []; // Track the active themes for each round
let selectedButtons = []; // Track the selected buttons
let countdownTimer; // Track the countdown timer
let isTimerPaused = false; // Track whether the timer is paused

function startTimer(seconds) {
  const timerInput = document.getElementById("time");

  let remainingSeconds = seconds;

  function updateTimer() {
    if (!isTimerPaused) {
      timerInput.value = remainingSeconds;

      if (remainingSeconds === 0) {
        clearInterval(countdownTimer);
        // Handle timeout here (e.g., show alert and reset the game)
        alert("Game over!");
        resetGame();
      }

      remainingSeconds--;
    }
  }

  // Clear any existing countdown timer
  clearInterval(countdownTimer);

  // Call the updateTimer function immediately to display the initial value
  updateTimer();

  // Set up an interval to update the timer every second
  countdownTimer = setInterval(updateTimer, 1000);
}

function resetGame() {
  // Reset the round to 1
  round = 1;

  // Reset the timer input display
  const timerInput = document.getElementById("time");
  timerInput.value = 0;

  // Reset the timer input display
  const roundInput = document.getElementById("round");
  roundInput.value = round;

  // Load the initial game
  loadGame();
}

function generateButtons() {
  // Access the "wordList" container
  const wordListContainer = document.getElementById("wordList");
  wordListContainer.innerHTML = ""; // Clear previous buttons

  // Create an array to store all selected words for this round
  const selectedWords = [];

  // Pick 2 words from the roundTheme's "Words" array
  const roundThemeWords = roundTheme.Words;
  const roundWords = [];
  while (roundWords.length < 2 && roundThemeWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * roundThemeWords.length);
    const randomWord = roundThemeWords.splice(randomIndex, 1)[0];
    selectedWords.push(randomWord);
    roundWords.push(randomWord);
  }

  // Pick 1 word from each active theme's "Words" array
  activeThemes.forEach((activeTheme) => {
    const words = activeTheme.Words;
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words.splice(randomIndex, 1)[0];
    selectedWords.push(randomWord);
  });

  // Shuffle the selected words (Fisher-Yates shuffle)
  for (let i = selectedWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedWords[i], selectedWords[j]] = [selectedWords[j], selectedWords[i]];
  }

  // Create HTML buttons for each selected word (total of 6)
  selectedWords.forEach((word) => {
    // Create a button element
    const button = document.createElement("button");
    button.textContent = word;

    // Add a click event listener to handle selections
    button.addEventListener("click", () => {
      if (selectedButtons.length < 2) {
        // Add the button to the selected buttons array
        selectedButtons.push(button);

        // Change border color to black
        button.classList.add("selected");

        // Check if two buttons are selected
        if (selectedButtons.length === 2) {
          // Get the selected words
          const selectedWord1 = selectedButtons[0].textContent;
          const selectedWord2 = selectedButtons[1].textContent;

          // Check if both selected words match the roundTheme
          const isMatch =
            roundWords.includes(selectedWord1) &&
            roundWords.includes(selectedWord2);

          // If both selected words match the roundTheme, turn the borders green and proceed to the next round
          if (isMatch) {
            selectedButtons.forEach((selectedButton) => {
              button.classList.remove("selected");
              button.classList.add("correct");
            });

            // Display the roundTheme for 800ms
            document.getElementById("theme").textContent = roundTheme.Theme;
            setTimeout(() => {
              document.getElementById("theme").textContent = "";
              round += 1;
              loadGame();
            }, 800); // Adjust the delay as needed
          } else {
            // If the words don't match, revert the border colors to the original color
            selectedButtons.forEach((selectedButton) => {
              button.classList.remove("selected");
            });
          }

          // Clear the selected buttons array
          selectedButtons.length = 0;
        }
      }
    });

    // Append the button to the "wordList" container
    wordListContainer.appendChild(button);
  });
}

function loadGame() {
  // Load and parse the JSON file
  fetch("themes.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load JSON file.");
      }
      return response.json();
    })
    .then((data) => {
      // Access the array of themes
      const themesArray = data.Themes;

      // Shuffle the array of themes (Fisher-Yates shuffle)
      for (let i = themesArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [themesArray[i], themesArray[j]] = [themesArray[j], themesArray[i]];
      }

      // Select one theme as the "roundTheme" for this round
      roundTheme = themesArray.pop();
      activeThemes = [];

      // Select 4 other themes as "activeThemes" for this round
      while (activeThemes.length < 4 && themesArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * themesArray.length);
        const randomTheme = themesArray.splice(randomIndex, 1)[0];
        activeThemes.push(randomTheme);
      }

      // Display the current round
      const roundInput = document.getElementById("round");
      roundInput.value = round;

      // Generate buttons for the current round
      generateButtons();

      // Start the countdown timer for 10 seconds
      startTimer(1000);
    })
    .catch((error) => {
      console.error(error);
    });
}

// Call resetGame() to initialize the game when the page loads
resetGame();
