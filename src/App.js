import React, { useState, useEffect } from "react";
import Scoreboard from "./Scoreboard";
import themes from "./Themes"; // Importing themes
import "./App.css";

const App = () => {
  const [words, setWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [time, setTime] = useState(10);
  const [turnTheme, setTurnTheme] = useState(null);
  const [auxThemes, setAuxThemes] = useState([]);

  // Function to randomly select themes and initialize words
  const initializeGame = () => {
    const shuffledThemes = [...themes].sort(() => 0.5 - Math.random());
    const selectedThemes = shuffledThemes.slice(0, 5);

    const chosenTurnTheme =
      selectedThemes[Math.floor(Math.random() * selectedThemes.length)];
    const chosenAuxThemes = selectedThemes.filter(
      (theme) => theme !== chosenTurnTheme
    );

    setTurnTheme(chosenTurnTheme);
    setAuxThemes(chosenAuxThemes);

    const turnWords = chosenTurnTheme.words.slice(0, 2);
    const auxWords = chosenAuxThemes.map(
      (theme) => theme.words[Math.floor(Math.random() * theme.words.length)]
    );
    setWords(turnWords.concat(auxWords));
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const timer = time > 0 && setTimeout(() => setTime(time - 1), 1000);

    if (time === 0) {
      // GAME OVER
    }

    return () => clearTimeout(timer); // Reset the timer
  }, [time, round]);

  // Check to see if the words belong to the same theme
  const doWordsMatch = (word1, word2) => {
    const word1Theme = themes.find((theme) => theme.words.includes(word1));
    const word2Theme = themes.find((theme) => theme.words.includes(word2));
    return word1Theme && word2Theme && word1Theme.theme === word2Theme.theme;
  };

  const handleWordClick = (selectedWord) => {
    const updatedSelection = selectedWords.includes(selectedWord)
      ? selectedWords.filter((word) => word !== selectedWord)
      : [...selectedWords, selectedWord];
    setSelectedWords(updatedSelection);

    if (updatedSelection.length === 2) {
      if (doWordsMatch(updatedSelection[0], updatedSelection[1])) {
        setScore(score + 10);

        let newWords = [...words]; // Copy current words

        // Replace each matched word with a new word
        updatedSelection.forEach((matchedWord) => {
          const wordIndex = newWords.indexOf(matchedWord);
          if (wordIndex !== -1) {
            // Select a new word for replacement
            let newWord;
            let replacementTheme;

            // If it's the first word, select from a new turnTheme
            if (matchedWord === updatedSelection[0]) {
              const remainingAuxThemes = auxThemes.filter(
                (theme) => !newWords.includes(theme.words[0])
              );
              replacementTheme =
                remainingAuxThemes[
                  Math.floor(Math.random() * remainingAuxThemes.length)
                ];
              setTurnTheme(replacementTheme);
            } else {
              // For the second word, select from a new auxTheme
              const potentialNewAuxThemes = themes.filter(
                (theme) => theme !== turnTheme && !auxThemes.includes(theme)
              );
              replacementTheme =
                potentialNewAuxThemes[
                  Math.floor(Math.random() * potentialNewAuxThemes.length)
                ];
              setAuxThemes([...auxThemes, replacementTheme]); // Add new auxTheme
            }

            newWord = replacementTheme.words.find(
              (word) => !newWords.includes(word)
            );
            newWords[wordIndex] = newWord; // Replace the matched word
          }
        });
        setRound(round + 1); // Increment round
        setTime(10); // Reset timer for the new round
        setWords(newWords);
      } else {
        alert("Not a match, try again!");
      }
      setTimeout(() => setSelectedWords([]), 1000);
    }
  };

  return (
    <div className="App">
      <header className="page-header">
        <h1 className="logo">Word Pears</h1>
        <p className="instructions">
          Select the pair of words that match best.
        </p>
      </header>
      <Scoreboard round={round} time={time} />
      <div id="wordList">
        {words.map((word, index) => (
          <button
            key={index}
            onClick={() => handleWordClick(word)}
            className={selectedWords.includes(word) ? "selected" : ""}
          >
            {word}
          </button>
        ))}
      </div>
      <p id="theme"></p>
    </div>
  );
};

export default App;
