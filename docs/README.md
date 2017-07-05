# Word Finder

## Background

Word Finder is a scrabble type game that took inspiration from Scramble with Friends.  16 letters are randomly assigned on a 4x4 board and the goal is to accumulate as many words and points as possible by chaining adjacent letters together to form words.  Diagonal letters are considered adjacent.

## MVP

- 4x4 board with randomly assigned letters
- Add value to letters
- Start and reset buttons to randomize the letters on the board
- User can "find" words by using the mouse to link the letters together to form words
- Validate that the words are found in the dictionary and only if they are, submit points and add word to a list of words found.
- Timer (2 mins)

## Wireframes

![wireframes](./Word_Finder.png)

## Architecture and Technologies

This project will be implemented with the following technologies:
- JavaScript
- jQuery
- HTML
- CSS
- Canvas

A significant challenge would be to how users would submit words.  The user will be able to use their mouse to draw out a path along adjacent letters to form words.  The word then needs to be submitted when the mouse is released.  There will need to be many event listeners.  jQuery will be used to find the mouse coordinates.

## Timeline

### Day 1
- Setup Node modules, webpack, word-list library
- Create webpack.config.js and package.json
- Create a board.js file and implement a start() and reset() function that randomizes the board
- Handle user mouse input and user submit word (when mouse is released)
- Instructions

### Day 2
- Word list lib or API
- Validate word
- Scoring
- Timer

### Day 3

- Style the page
- Any bonus features

## Bonus Features

- List all possible words when game ends
- List of high scores
- Double letter, Triple letter
- Items: freeze, inspiration, spin, vision
