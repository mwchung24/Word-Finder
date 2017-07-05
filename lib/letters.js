const LETTERS = {
  "A": {
    frequency: 9,
    value: 1,
  },

  "B": {
    frequency: 2,
    value: 4,
  },

  "C": {
    frequency: 2,
    value: 4,
  },

  "D": {
    frequency: 5,
    value: 2,
  },

  "E": {
    frequency: 13,
    value: 1,
  },

  "F": {
    frequency: 2,
    value: 4,
  },

  "G": {
    frequency: 3,
    value: 3,
  },

  "H": {
    frequency: 4,
    value: 3,
  },

  "I": {
    frequency: 8,
    value: 1,
  },

  "J": {
    frequency: 1,
    value: 10,
  },

  "K": {
    frequency: 1,
    value: 5,
  },

  "L": {
    frequency: 4,
    value: 2,
  },

  "M": {
    frequency: 2,
    value: 4,
  },

  "N": {
    frequency: 5,
    value: 2,
  },

  "O": {
    frequency: 8,
    value: 1,
  },

  "P": {
    frequency: 2,
    value: 4,
  },

  "Q": {
    frequency: 1,
    value: 10,
  },

  "R": {
    frequency: 6,
    value: 1,
  },

  "S": {
    frequency: 5,
    value: 1,
  },

  "T": {
    frequency: 7,
    value: 1,
  },

  "U": {
    frequency: 4,
    value: 2,
  },

  "V": {
    frequency: 2,
    value: 5,
  },

  "W": {
    frequency: 2,
    value: 4,
  },

  "X": {
    frequency: 1,
    value: 8,
  },

  "Y": {
    frequency: 2,
    value: 3,
  },

  "Z": {
    frequency: 1,
    value: 10,
  },
};

class GenerateLetter {
  constructor () {
    this.letters = [];

    this.lettersFrequency();
  }

  lettersFrequency () {
    Object.keys(LETTERS).forEach(letter => {
      for (var i = 0; i < LETTERS[letter].frequency; i++) {
        this.letters.push(letter);
      }
    });
  }

  lettersValue (letter) {
    return LETTERS[letter].value;
  }

  randomLetter () {
    return this.letters[Math.floor(Math.random() * this.letters.length)];
  }
}

module.exports = GenerateLetter;
