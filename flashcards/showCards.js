
const path = 'flashcards/decks/JSONFiles/';
const Files = [
    "geometrical_vectors",
    "Quotes"
];
const mainContainer = document.getElementById('mainContainer');

Files.forEach((file, index) => {
    fetch('../'+path+file + '.json')
        .then(response => response.json())
        .then(cards => {
          const heading = document.createElement('h2');
          heading.textContent = 'NEW DECK OF CARDS'; // Set the text content of the heading
          mainContainer.appendChild(heading); // Append the heading to the main container
          const container = document.createElement('div');
            container.id = `cardsContainer${index}`;
            container.className = 'cards-container';
            mainContainer.appendChild(container);

            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `<h3>${card.term}</h3><p>${card.definition}</p>`;
                container.appendChild(cardElement);
            });

            MathJax.typesetPromise()
                .then(() => {
                    console.log('Equations have been rendered.');
                }).catch(err => console.error('Error typesetting equations:', err));
        }) 
        .catch(error => console.error('Error loading cards from:', file, error));
});