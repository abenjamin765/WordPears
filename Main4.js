let themes = []; // Store loaded themes data
let roundTheme = null; // Store the current round's theme

// Function to fetch data from "themes.json"
function fetchThemesData() {
  fetch("themes.json")
    .then((response) => response.json())
    .then((data) => {
      themes = data.Themes;
      // Check if themes are loaded correctly
      if (!themes || themes.length === 0) {
        console.error("No themes found in the JSON file.");
        return;
      }
      // Select the first roundTheme at random
      selectRoundTheme();
    })
    .catch((error) => console.error(error));
}

// Function to select the first roundTheme at random
function selectRoundTheme() {
  if (themes.length === 0) {
    console.error("No themes available.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * themes.length);
  roundTheme = themes[randomIndex];
  console.log("Round Theme:", roundTheme.Theme);
  // Continue with other initialization tasks
}

// Call the function to fetch themes data and start the game
fetchThemesData();
