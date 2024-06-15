class DisplayCards {
    
    constructor() {
        this.path = '../../flashcards/decks/JSONFiles/';
        this.files = ["Geometrical_Vectors", "Quotes", "Matrices"];
        this.mainContainer = document.getElementById('mainContainer');
        this.hierarchyPaths = [];
        this.createDisplay().then(() => this.createHierarchyTree());  // this shit took forever to find
    }

    async createDisplay() {
        await Promise.all(this.files.map(file => 
            fetch(this.path + file + '.json')
                .then(response => response.json())
                .then(cards => {
                    this.hierarchyPaths.push(this.createHierarchy(cards));
                    
                    const container = document.createElement('div');
                    container.className = 'cards-container';
                    this.mainContainer.appendChild(container);
                    
                    cards.forEach(card => {
                        const cardElement = this.createCardElement(card);
                        container.appendChild(cardElement);
                    });
                    
                    return MathJax.typesetPromise();
                })
                .catch(error => console.error('Error loading cards from:', file, error))
        ));
    }

    createHierarchy(cards) {
        return cards[0].category.split('::'); // cards share hierarchy, extracting one is enough
    }

    createHierarchyTree() {
        const root = {};
    
        this.hierarchyPaths.forEach(list => {
            let currentLevel = root;
    
            list.forEach((item, index) => {   // Check if the next level of the tree needs to be created
                if (!currentLevel[item]) {
                    currentLevel[item] = {};
                }
    
                // Move to the next level
                currentLevel = currentLevel[item];
    
                // If last item, mark as endpoint
                if (index === list.length - 1) {
                    currentLevel.end = true;
                }
            });
        });
            console.log(root);
        
            
    }

    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.innerHTML = `<cf>${this.unescapeLatex(card.term)}</cf>`; // cf cardfront

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back'; 
        cardBack.innerHTML = `<cb>${this.unescapeLatex(card.definition)}</cb>`; // cb cardback

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        return cardElement;
    }

    unescapeLatex(text) {
        return text.replace(/\\\\/g, '\\'); // Convert double backslashes to a single backslash
    }
}

new DisplayCards();
