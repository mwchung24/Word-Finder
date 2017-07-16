# Word Finder

Demo the game [here][word-finder]!

[word-finder]: https://mwchung24.github.io/Word-Finder/

Word Finder is a boggle like game that was inspired by Scramble With Friends (otherwise known as Word Streak).  The game was built using JavaScript and jQuery.

![game](./assets/images/game.png)

## How to Play

The goal of the game is for the user to the find as many words as they can in 60 seconds.  A user can enter their name under the "High Scores" header in order to keep track of their scores.  When the start button is clicked, a 4x4 board of letters will appear.  A restart button will then replace the start button that will allow the user restart and randomize the board.  The user can click and drag across adjacent tiles to create words (users can drag diagonally).  The word will then be compared with a dictionary and will only be submitted into the Words Found section if the word is found in the dictionary.  Once a word is submitted into the Words Found section, the score will be updated.  The high scores section will only render the top 10 highest scores.  If the user's score is high enough to break the top 10 scores, then the high scores will be updated with the user's username and score in real time.

## Implementation

### Creating Words
The ability for the user to be able to click and drag to create words was implemented using jQuery and mouse events.

```javascript
//sets up mouse event listeners on the tiles
setupBoard() {
  this.submitted_words = [];
  $("#board ul li")
    .on("mousedown", this.MouseDown)
    .on("mouseenter", this.MouseEnter);
}

//a mouse event that starts to create a "word" to compare against the dictionary
//submitbar is filled in as the user drags across adjacent tiles
MouseDown (e) {
  e.preventDefault();
  let tile = $(e.currentTarget);
  tile = tile.data().pos;
  this.selectedTiles.push(tile);
  this.selected = true;
  $("#submitBar input")
    .val(e.currentTarget.children[1].innerHTML);
}

//a mouse event that adds letters to the word as the mouse
//enters the tiles
MouseEnter(e) {
  e.preventDefault();

  let tile = $(e.currentTarget);

  tile = tile.data().pos;
  if (this.selected === true) {
    if (this.adjacentTiles(tile)) {
      $("#board ul li")
      .on("hover", $(e.currentTarget).addClass('active'));
      if (!this.selectedTiles.includes(tile)) {
        this.selectedTiles.push(tile);
        $("#submitBar input")
        .val(function(index, val) {
          return val + e.currentTarget.children[1].innerHTML;
        });
      }
    }
  }
}

//a mouse event that ends the creation of a word,
//submits word and score if word is found in the dictionary
MouseUp (e) {
  e.preventDefault();
  this.selected = false;
  this.selectedTiles = [];
  let $li = $('<li>');
  if(this.trie.validWord($("#submitBar input").val())) {
    if(!this.submitted_words.includes($("#submitBar input").val())) {
      $li.append($("#submitBar input").val());
      $("#submittedWords ul")
      .prepend($li);
      this.submitted_words.push($("#submitBar input").val());
      this.keepScore($("#submitBar input").val());
    }
  }

  $("#submitBar input")
    .val("");

  $("#board ul li").removeClass("active");
}
```

Users can only select tiles that are adjacent to the current tile and cannot select tiles that have already been selected.  This was solved by storing all of the visited tile's positions in an array.
```javascript
//Checks to see if the current tile and the next
//tile are adjacent.  Does not allow for non-adjacent drags
adjacentTiles (pos) {
  const adjacent = [
    [-1, -1],
    [-1,  0],
    [-1,  1],
    [ 0,  1],
    [ 0, -1],
    [ 1, -1],
    [ 1,  0],
    [ 1,  1]
  ];

  for (let i = 0; i < adjacent.length; i++) {
    let lastTile = this.selectedTiles[this.selectedTiles.length - 1];
    if (JSON.stringify([pos[0] - lastTile[0], pos[1] - lastTile[1]]
      .sort()) === JSON.stringify(adjacent[i])) {
      return true;
    }

  }
  return false;
}
```

### Dictionary Lookup

A trie was built for quick look up of the dictionary.  The dictionary has around 178k words and having an efficient way to check against the dictionary was important.

```javascript
//The dictionary file holds around 178k words.  To create efficient look-up,
//a trie was built.  Every word of the dictionary is created in this trie.  
//Each letter of a word would be a new node of the trie.  
//For example, every word would start at the root.  For the word "cat",
//the letter "c" would be the first child of the root, followed by "a" and "t".  
//A submitted word would be considered a word when all its letters are found on
//a branch of the trie. 
class Trie {
  constructor () {
    this.root = new TrieNode("");
  }

  buildTrie (word) {
    let currentNode = this.root;
    for (let i = 0; i < word.length; i++) {
      if (currentNode.children[word[i]]) {
        currentNode = currentNode.children[word[i]];
      } else {
        let newNode = new TrieNode(word[i]);
        currentNode.addChild(newNode);
        currentNode = newNode;
      }
    }
    currentNode.isWord = true;
  }

  validWord(word) {
    let currentNode = this.root;
    for (let i = 0; i < word.length; i++) {
      if(currentNode.children[word[i]]) {
        currentNode = currentNode.children[word[i]];
      } else {
        return false;
      }
    }

    return currentNode.isWord;
  }
}

class TrieNode {
  constructor (letter) {
    this.letter = letter;
    this.children = {};
    this.isWord = false;
  }

  addChild(newNode) {
    this.children[newNode.letter] = newNode;
  }
}
```

### High scores

The username and scores are stored on a FireBase database and can persist between page refreshes and even on different computers.

```javascript
//submits the username and score to a firebase database
let newScore = firebase.database().ref("scores").push();
window.newScore = newScore;
let username = $(".highscores input").val();
if (username) {
  newScore.set({username: `${username}`, score: parseInt(this.score)});
} else {
  newScore.set({username: `User1`, score: parseInt(this.score)});
}

//fetches the top 10 highscores and renders them to the screen
var scoresTable = firebase.database().ref("scores");
scoresTable.orderByChild("score").limitToLast(10).on('value', (snapshot, highscores) => {
  $(".Instruct ol li").remove();
  highscores = [];
  snapshot.forEach(childSnapshot => {
    highscores.push((childSnapshot.val()));
  });
    highscores.reverse();
  for (let i = 0; i < highscores.length; i++) {
    let $li = $('<li>');
    $(".Instruct ol").append($li.text(`${highscores[i].username}: ${highscores[i].score} points`));
  }
});
```

## Future Improvements

### Path between tiles
As users click and drag across the tiles, a path should render between the tiles.

### Double/Triple Letter
2-3 words would randomly be assigned a double or triple letter "power up".

### Power Up Items
Similar to Scramble with Friends, give user a choice to pick between 4 power ups.
1. Freeze: Stop the timer for 15 seconds.
2. Inspiration: Highlights a word a user has not found.
3. Spin: Rotates the board to provide different perspective.
4. Vision: Shows 3 words that have not been found in a modal.
