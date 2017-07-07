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

module.exports = Trie;
