class DisplayCards {
    
    constructor() {
        this.path = '../../flashcards/decks/JSONFiles/';
        this.files = ["Geometrical_Vectors", "Quotes", "Matrices"];
        this.mainContainer = document.getElementById('mainContainer');
        this.createDisplay();
    }

    createDisplay() {
        this.files.forEach((file, index) => {
            fetch( this.path + file + '.json')
            .then(response => response.json())
            .then(cards => {
                const container = document.createElement('div');
                container.className = 'cards-container';
                this.mainContainer.appendChild(container);

                cards.forEach(card => {
                    const cardElement = this.createCardElement(card);
                    container.appendChild(cardElement);
                });

                MathJax.typesetPromise()
                .then(() => {
                    console.log('Equations have been rendered.');
                }).catch(err => console.error('Error typesetting equations:', err));
            })
            .catch(error => console.error('Error loading cards from:', file, error));
        });
    }

    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.innerHTML =`<c>${this.unescapeLatex(card.term)}</c>`; // Front of card

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back'; 
        cardBack.innerHTML = `<p>${this.unescapeLatex(card.definition)}</p>`; 

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        return cardElement;
    }
    unescapeLatex(text) {
        return text.replace(/\\\\/g, '\\') // Convert double backslashes to a single backslash
    }
}

new DisplayCards();
