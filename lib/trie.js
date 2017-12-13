class Trie {
  constructor () {
    this.root = new TrieNode("");
  }

  buildTrie (word) {
    // current node or root is set to an empty trie node
    let currentNode = this.root;
    // iterate through the word argument
    for (let i = 0; i < word.length; i++) {
      // check to see if the letter is part of the current node's
      // children
      if (currentNode.children[word[i]]) {
        // reset the current node to the child node aka the next node
        currentNode = currentNode.children[word[i]];
      } else {
        // new node with the new letter is made into the current
        // node's children
        // then reset the current node to the child node aka the next node
        let newNode = new TrieNode(word[i]);
        currentNode.addChild(newNode);
        currentNode = newNode;
      }
    }
    currentNode.isWord = true;
  }

  validWord(word) {
    // starts the current node as an empty trie node
    let currentNode = this.root;
    // iterate through the word
    for (let i = 0; i < word.length; i++) {
      // check to see if the next letter is the in the current node's
      // children
      if(currentNode.children[word[i]]) {
        // reset the current node to the child node aka the next node
        currentNode = currentNode.children[word[i]];
      } else {
        // if not found... then it is not a word....
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

module.exports = Trie;
