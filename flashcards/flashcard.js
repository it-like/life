

//  Flashcards, txt-> list
// hard-coded for specific deck, fix later!

var fs = require('fs');
// Cards have format [deck, front, back, tags]
fs.readFile('flashcards/deck/linearAlgebra/geometrical_vectors.txt', 'utf-8', (err, data) =>{
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


    // Create JSON of data, replaces file if path already exists
    fs.writeFile('flashcards/deck/linearAlgebra/JSONFiles/cards.json', JSON.stringify(cards, null, 2), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Data has been converted to JSON');
        }
      });

})

