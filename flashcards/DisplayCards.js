
class DisplayCards{
    
    constructor(){
         this.path = 'flashcards/decks/JSONFiles/';
         this.files = [
                        "geometrical_vectors",
                        "Quotes"];
    this.mainContainer = document.getElementById('mainContainer');
    this.createDisplay();
    }

    createDisplay(){
        this.files.forEach((file, index) => {
        fetch('../' + this.path + file + '.json')
        .then(response => response.json()) // response is an arbitrary keyword for the Response from the fetch
        .then(cards => {
            const heading = document.createElement('h3');
            heading.textContent = 'NEW DECK OF CARDS'; // Set the text content of the heading
            this.mainContainer.appendChild(heading); // Append the heading to the main container
            const container = document.createElement('div');
                container.id = `cardsContainer${index}`;
                container.className = 'cards-container';
                this.mainContainer.appendChild(container);

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

            }).catch(error => console.error('Error loading cards from:', file, error));
        });
    }
}

new DisplayCards();