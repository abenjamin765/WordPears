import { fetchWords, submitAnswer } from "./api";

let roundTimer = 10;
let intervalId;
let roundNumber = 1;
let themes;
let roundTheme;
let roundThemeId;
let activeWords = [];
let selectionOne, selectionTwo;
let selections = [];
let numberOfSelectionsToMake;

async function initializeGame() {
  // Load the themes from the JSON file
  // const response = await fetch("themes.json");
  // const data = await response.json();
  // themes = data.Themes;

  // Set up the initial round and start the timer
  await setupRound(1);
  startTimer();
}
async function setupRound(roundNumber) {
  // // Select the round theme
  // roundTheme = themes[Math.floor(Math.random() * themes.length)];
  // activeWords = roundTheme.Words.slice(0, 2);

  // // Select 4 additional themes and extract one word from each
  // let addedThemes = 0;
  // while (addedThemes < 4) {
  //   const tempTheme = themes[Math.floor(Math.random() * themes.length)];
  //   if (
  //     tempTheme.Theme !== roundTheme.Theme &&
  //     !activeWords.includes(tempTheme.Words[0])
  //   ) {
  //     activeWords.push(tempTheme.Words[0]);
  //     addedThemes++;
  //   }
  // }

  const { theme, words } = await fetchWords(roundNumber);
  roundThemeId = theme;
  switch (roundNumber) {
    case 2:
    case 3:
      numberOfSelectionsToMake = 2;
      break;
    case 1:
    default:
      numberOfSelectionsToMake = 2;
      break;

  }

  if (words.length <= numberOfSelectionsToMake) {
    console.error('There should be more words to choose from than need to be selected')
  }

  // Capable of pushing N words instead of just N = 6
  activeWords.push(...words);

  displayWords();
}
function displayWords() {
  const wordListElem = document.getElementById("wordList");
  wordListElem.innerHTML = "";
  activeWords.forEach((word) => {
    const btn = document.createElement("button");
    btn.innerText = word;
    btn.addEventListener("click", selectWord);
    wordListElem.appendChild(btn);
  });
}

// Consider refactor which adds buttons to an array
// Every time a button is added to the array, a check is made: is the length of the array gte the round's selected number
// If so, call check solution
function selectWord(event) {
  // const button = event.target;
  // if (!selectionOne) {
  //   selectionOne = button;
  // } else if (!selectionTwo && selectionOne !== button) {
  //   selectionTwo = button;
  // } else {
  //   return;
  // }

  button.classList.add("selected");
  selections.push(button);

  // if (selectionOne && selectionTwo) {
  //   validateSelection();
  // }
  if (selections.length > numberOfSelectionsToMake) {
    console.error('There are more selected values than are supposed to be selected for this round');
  }
  if (selections.length === numberOfSelectionsToMake) {
    validateSelection();
  }
}


function validateSelection() {
  // const word1 = selectionOne.innerText;
  // const word2 = selectionTwo.innerText;

  // if (roundTheme.Words.includes(word1) && roundTheme.Words.includes(word2)) {
  //   selectionOne.classList.add("correct");
  //   selectionTwo.classList.add("correct");
  //   document.getElementById("theme").innerText = roundTheme.Theme;
  //   setTimeout(transitionToNextRound, 1000);
  // } else {
  //   selectionOne.classList.remove("selected");
  //   selectionTwo.classList.remove("selected");
  //   selectionOne = null;
  //   selectionTwo = null;
  // }
  const wordsToValidate = selections.map(selection => selection.innerText);
  const { isCorrect, theme } = await submitAnswer(roundThemeId, wordsToValidate);
  // If isCorrect is true, theme should be included and is an error if not
  if (isCorrect) {
    if (!theme) {
      console.error('Theme missing from api response')
    }

    for (const selection of selections) {
      selection.classList.add("correct");
    }
    document.getElementById("theme").innerText = theme;
    setTimeout(transitionToNextRound, 1000);
  } else {
    for (const selection of selections) {
      selection.classList.remove("selected");
      selections = [];
    }
  }
}
function transitionToNextRound() {
  const possibleThemes = themes.filter((theme) =>
    activeWords.some((word) => theme.Words.includes(word))
  );
  const newRoundTheme =
    possibleThemes[Math.floor(Math.random() * possibleThemes.length)];
  // Clear theme display
  document.getElementById("theme").innerText = "";

  // Choose a word to replace from a different theme
  const wordsFromOtherThemes = themes
    .filter((theme) => theme.Theme !== roundTheme.Theme)
    .flatMap((theme) => theme.Words)
    .filter((word) => !activeWords.includes(word));
  const randomWordFromOtherThemes =
    wordsFromOtherThemes[
    Math.floor(Math.random() * wordsFromOtherThemes.length)
    ];

  // Choose a word from the new theme
  const wordFromNewRoundTheme = newRoundTheme.Words.find(
    (word) => !activeWords.includes(word) && word !== randomWordFromOtherThemes
  );

  // Replace the words in activeWords
  const indexToReplace1 = activeWords.indexOf(selectionOne.innerText);
  const indexToReplace2 = activeWords.indexOf(selectionTwo.innerText);
  activeWords[indexToReplace1] = randomWordFromOtherThemes;
  activeWords[indexToReplace2] = wordFromNewRoundTheme;

  roundTheme = newRoundTheme;

  // Reset selections
  selectionOne = null;
  selectionTwo = null;

  // Display the new words and restart the timer
  displayWords();
  startNewRound();
}
function startTimer() {
  document.getElementById("time").value = roundTimer;
  intervalId = setInterval(() => {
    roundTimer--;
    document.getElementById("time").value = roundTimer;
    if (roundTimer === 0) {
      clearInterval(intervalId);
      // Need to get the theme name from the theme id
      alert(`Game Over. The theme was ${roundTheme.Theme}.`);
    }
  }, 1000);
}

function startNewRound() {
  clearInterval(intervalId); // Reset the timer
  roundTimer = 10; // Reset timer value
  roundNumber++; // Increase the round number
  document.getElementById("round").value = roundNumber;
  startTimer();
}
initializeGame();
