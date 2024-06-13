

const container = document.getElementById('name_container');
var gustav = 'GUSTAV'.split('')

gustav.forEach((letter) => {
    let nodeElement = document.createElement('div');
    nodeElement.className = 'letter';
    nodeElement.textContent = letter;
    container.appendChild(nodeElement);
    console.log(letter)
});


