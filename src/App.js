import React, { useState, useEffect } from "react";
import Scoreboard from "./Scoreboard";
import themes from "./Themes"; // Importing themes
import "./App.css";
import { checkWords, getWords } from "./api/api-handler";

const roundWordsMap = {
  "1": { solutionCt: 2, nonSolutionCt: 4 }
}

const App = () => {
  const [words, setWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [time, setTime] = useState(10);
  const [turnTheme, setTurnTheme] = useState(null);
  const [auxThemes, setAuxThemes] = useState([]);

  // Function to randomly select themes and initialize words
  // const initializeGame = async () => {
  //   /**
  //    * Notes (MJ 11 Dec 23)
  //    * 
  //    * We want to be careful about setting the theme in the component's state
  //    * A savvy player will be able to use the developer's tools to determine the theme this way
  //    */

  //   // const shuffledThemes = [...themes].sort(() => 0.5 - Math.random());
  //   // const selectedThemes = shuffledThemes.slice(0, 5);

  //   // const chosenTurnTheme =
  //   //   selectedThemes[Math.floor(Math.random() * selectedThemes.length)];
  //   // const chosenAuxThemes = selectedThemes.filter(
  //   //   (theme) => theme !== chosenTurnTheme
  //   // );

  //   // setTurnTheme(chosenTurnTheme);
  //   // setAuxThemes(chosenAuxThemes);

  //   // const turnWords = chosenTurnTheme.words.slice(0, 2);
  //   // const auxWords = chosenAuxThemes.map(
  //   //   (theme) => theme.words[Math.floor(Math.random() * theme.words.length)]
  //   // );
  //   // setWords(turnWords.concat(auxWords));


  //   /**
  //    * Instead, retrieve a set of words from the backend
  //    * A unique solution is guaranteed by this request
  //    */
  //   try {
  //     const { success, data: words } = await getWords();
  //     setWords(success ? words : []);
  //   } catch (err) {
  //     console.error('Error retrieving game', err);
  //     setWords([]);
  //   }
  // };

  useEffect(() => {
    setWordsAndTheme();
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
  const doWordsMatch = async (words) => {
    const { success, isCorrect } = await checkWords({theme: turnTheme, words: words});

    // Handle { success: false }
    if (!success) {
      console.error('HANDLE THIS ERROR');
    }

    return isCorrect;
  };

  const handleWordClick = async (selectedWord) => {
    const updatedSelection = selectedWords.includes(selectedWord)
      ? selectedWords.filter((word) => word !== selectedWord)
      : [...selectedWords, selectedWord];
    setSelectedWords(updatedSelection);
    // const { solutionCt } = roundWordsMap[round]; // The resolution of what we call a "round" needs to happen here.

    const { solutionCt } = roundWordsMap[1];
    if (updatedSelection.length === solutionCt) {
      if (await doWordsMatch(updatedSelection)) {
        setScore(score + 10);
        setRound(round + 1); // Increment round
        setTime(10); // Reset timer for the new round
        await setWordsAndTheme();
      } else {
        alert("Not a match, try again!");
      }
      setTimeout(() => setSelectedWords([]), 1000);
    }
  };

  const setWordsAndTheme = async (round) => {
    try {
      const { success, data } = await getWords();
      const { theme , words } = data;
      setWords(success ? words : []);
      setTurnTheme(success ? theme : '')
    } catch (err) {
      console.error('Error retrieving game', err);
      setWords([]);
    }
  }

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
