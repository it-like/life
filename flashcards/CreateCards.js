class CreateCards {

  constructor(path) {
      this.TxtPath = 'flashcards/decks/TXTFiles/' + path + '.txt';
      this.jsonPath = 'flashcards/decks/JSONFiles/' + path + '.json';
      this.createCards();
  }

  createCards() {
      const fs = require('fs');
      fs.readFile(this.TxtPath, 'utf-8', (err, data) => {
          if (err) {
              console.error(err);
              return;
          }

          let rows = data.split('\n');
          let cards = [];
          rows.forEach((row) => {
              if (row.trim()) {
                  let parts = row.split('\t');
                  if (parts.length == 4) {
                      let card = {
                          category: (parts[0]),
                          term: (parts[1]),
                          definition: (parts[2]),
                          tags: (parts[3]),
                      };
                      cards.push(card);
                  } else {
                      console.error('Card format not \'[deck, front, back, tags]\'. Skipping', row);
                  }
              }
          });

          fs.writeFile(this.jsonPath, JSON.stringify(cards, null, 2), (err) => {
              if (err) {
                  console.error(err);
              } else {
                  console.log('Data has been converted to JSON');
              }
          });
      });
  }

}

new CreateCards('Geometrical_Vectors');
new CreateCards('Quotes');
new CreateCards('Matrices');
