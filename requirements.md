Initializing the Game:

- Set up a timer called roundTimer with an initial value of 10 seconds.
- Display the timer value in an element with the ID "time."
- Set the round number to 1 and display it in an element with the ID "round."
- Load data from a JSON file named "themes.json."
- Randomly select one theme from the list of themes and define it as the "roundTheme."
- Create an empty array called "activeWords."
- Add 2 words from the "roundTheme" to the "activeWords" array.
- Randomly select 4 additional themes.
- Add 1 word from each of the 4 themes to the "activeWords" array.
- Create buttons for each word in the "activeWords" array and display them in an element with the ID "wordList."

Player Interaction:

- Allow the player to select 2 words by clicking on buttons.
- When a button is clicked, add the class "selected" to the button and define it as "selectionOne" or "selectionTwo" based on the order of selection.
- After the second button is selected, check if both "selectionOne" and "selectionTwo" belong to the "roundTheme."
- If both selected words do not belong to the "roundTheme," remove the "selected" class from the buttons.
- If both selected words belong to the "roundTheme," add a "correct" class to both buttons and wait for 1 second.

After 1 second, transition to the Next Round:

- Randomly select a new "roundTheme" from the themes associated with the words in the "activeWords" array.
- Randomly choose either "selectionOne" or "selectionTwo."
- Replace the selected word with a new word that does not belong to the same theme as any other word in the "activeWords" array.
- Replace the other selected word with a word from the new "roundTheme" that does not match any other word in the "activeWords" array.

Starting the Next Round:

- Reset the timer to 10 seconds.
- Increment the round number by 1.

Game Over:

- If the timer runs out before starting the next round, display an Alert with the message "Game Over. The theme was ${roundTheme}."
