



// Class for creating deck with cards, .txt-> .JSON
class CreateDeckWithCards{


  constructor(path){
    this.TxtPath = 'flashcards/deck/TXTFiles/' + path + '.txt';
    this.jsonPath = 'flashcards/deck/JSONFiles/' + path + '.json';
    this.createCards();
  }

  // Cards have format [deck, front, back, tags]
  createCards(){
    const fs = require('fs');
    fs.readFile(this.TxtPath, 'utf-8', (err, data) =>{
      if (err){
          console.error(err);
          return;
      }

      let rows = data.split('\n'); // row ≡ card
      let cards = [];
      rows.forEach((row) => {
          if (row.trim()) { // false if empty string ('')
            let parts = row.split('\t'); //  seperate at tabs
            if (parts.length == 4) { 
              let card = {
                category: parts[0].trim(),
                term: parts[1].trim(),
                definition: parts[2].trim(),
                tags:  parts[3].trim(),
              };
              cards.push(card);
            } else {
              console.error('Card format not \'[deck, front, back, tags]\'. Skipping', row);
            }
          }
        });
      //console.log(cards);
      // Create JSON of data, replaces file if path already exists for file
      fs.writeFile(this.jsonPath, JSON.stringify(cards, null, 2), (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Data has been converted to JSON');
          }
        });
  })
  }
};


new CreateDeckWithCards('geometrical_vectors');
new CreateDeckWithCards('Quotes');

