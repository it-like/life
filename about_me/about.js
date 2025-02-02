const dropDownButton = document.querySelector(".dropdown_button");
const dropDownMenu = document.querySelector(".dropdown_menu");

dropDownButton.addEventListener('click', () => {
    const items = dropDownMenu.querySelectorAll("a");
    const numItems = items.length;
    const totalDuration = 0.5; // seconds for entire sequence
    const itemDuration = totalDuration / numItems;
    // Dynamic distance: increases slightly with more items
    const distance =  numItems * 10;

    // Determine state: opening if currently hidden
    const opening = dropDownMenu.classList.contains('hide');

    if (opening) {
        dropDownMenu.classList.remove('hide');
        items.forEach((item, index) => {
            const delay = index * itemDuration * 1000; // Convert to milliseconds
            setTimeout(() => {
                item.style.transform = 'translateY(0)';
                item.style.opacity = 1;
            }, delay);
        });
    } else {
        // Animate out in reverse order.
        items.forEach((item, index) => {
            const delay = (numItems - 1 - index) * itemDuration * 1000; // Convert to milliseconds
            setTimeout(() => {
                item.style.transform = `translateY(-${distance}px)`;
                item.style.opacity = 0;
            }, delay);
        });
        setTimeout(() => {
            dropDownMenu.classList.add('hide');
        }, totalDuration * 1000);
    }
});
