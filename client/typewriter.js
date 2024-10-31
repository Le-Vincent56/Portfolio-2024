const phrases = ['GAMEPLAY PROGRAMMER', 'COMPOSER / AUDIO DESIGNER', 'WRITER'];
let currentPhraseIndex = 0;
let currentLetterIndex = 0;
let isDeleting = false;
const typingSpeed = 30; // Speed of typing in milliseconds
const deletingSpeed = 75; // Speed of deleting in milliseconds
const delayBetweenDeleting = 2000; // Delay before deleting in milliseconds
const delayBeforeNextPhrase = 1500; // Delay before typing the next phrase in milliseconds

let typewriterHeader;

const initializeEffect = () => {
    // Try to get the typewriter header
    typewriterHeader = document.getElementById('typewriter-header')

    // Check if retrieved
    if(typewriterHeader) {
        // Start the effect
        typeHeader();
    }
}

const typeHeader = () => {
    const currentPhrase = phrases[currentPhraseIndex];

    // Check if deleting
    if(isDeleting) {
        // Remove letters
        typewriterHeader.innerHTML = currentPhrase.slice(0, currentLetterIndex - 1);
        currentLetterIndex--;

        // Check if the word is completely deleted
        if(currentLetterIndex === 0) {
            // Notify to type
            isDeleting = false;

            // Go to the next phrase
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            
            // Set the delay
            setTimeout(typeHeader, delayBeforeNextPhrase);
        } else {
            // If not, then continue deleting
            setTimeout(typeHeader, deletingSpeed);
        }
    } else {
        // If not, add letters
        typewriterHeader.innerHTML = currentPhrase.slice(0, currentLetterIndex + 1);
        currentLetterIndex++;

        // Check if the entire phrase is typed out
        if(currentLetterIndex === currentPhrase.length) {
            // Notify to delete
            isDeleting = true;
            
            // Set the delay
            setTimeout(typeHeader, delayBetweenDeleting);
        } else {
            // If not, then continue typing
            setTimeout(typeHeader, typingSpeed);
        }
    }
}

module.exports = {
    initializeEffect
}