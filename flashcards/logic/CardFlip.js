class CardFlip {
    constructor() {
        // Add click event listeners to all cards
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                card.classList.toggle('flipped');
            }
        });

        // Optional: Add keyboard support for flipping
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                const selectedCard = document.querySelector('.card:hover');
                if (selectedCard) {
                    selectedCard.classList.toggle('flipped');
                }
            }
        });
    }
}

// Initialize card flipping when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CardFlip();
});