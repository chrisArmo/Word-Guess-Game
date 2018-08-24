/**
 * Pokemon Guessing Game:
 * Where users try and guess a randomly selected Pokemon
 * When user guesses correctly, they catch the Pokemon
 * 
 */

// Get random index
function getRandomIndex(collection, base = 0) {
    return Math.floor((Math.random() * collection.length) + base);
}

// Capitalize string
function capitalize(str) {
    return `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`;
}

// Get placeholder
function getPlaceholder(word) {
    return word.split("").map(letter => "_");
}

// Get pokemon
function getPokemon() {
    // Collection of pokemon & hints
    return [
        {
            name: "bulbasaur",
            src: "assets/images/bulbasaur.jpg",
            alt: "Black Bulbasaur silhouette, white background"
        },
        {
            name: "charmander",
            src: "assets/images/charmander.jpg",
            alt: "Black Charmander silhouette, white background"
        },
        {
            name: "squirtle",
            src: "assets/images/squirtle.jpg",
            alt: "Black Squirtle silhouette, white background"
        },
        {
            name: "dratini",
            src: "assets/images/dratini.jpg",
            alt: "Black Dratini silhouette, white background"
        },
        {
            name: "magikarp",
            src: "assets/images/magikarp.jpg",
            alt: "Black Magikarp silhouette, white background"
        },
        {
            name: "mewtwo",
            src: "assets/images/mewtwo.jpg",
            alt: "Black Mewtwo silhouette, white background"
        },
        {
            name: "pikachu",
            src: "assets/images/pikachu.jpg",
            alt: "Black Pikachu silhouette, white background"
        },
        {
            name: "snorlax",
            src: "assets/images/snorlax.jpg",
            alt: "Black Snorlax silhouette, white background"
        }
    ];
}

// Get dom elements
function getDomElements() {
    // Display h3
    const displayH3 = document.querySelector(".display"),
    // Attempts span
    attemptsSpan = document.querySelector(".attempts"),
    // Guesses span
    guessesSpan = document.querySelector(".guesses"),
    // Hint span
    image = document.querySelector("main img"),
    // Output paragraph
    outputP = document.querySelector(".output"),
    // End output h2
    endH2 = document.querySelector(".endOutput");

    return {displayH3, attemptsSpan, guessesSpan, image, outputP, endH2};
}

// Get game start state
function getGameStartState(pokemon) {
    // Accumulated guesses
    const guesses = [],
    // Random pokemon selection
    selectedPokemon = pokemon[getRandomIndex(pokemon)],
    // Set placeholder for display
    placeholder = getPlaceholder(selectedPokemon.name);

    return {guesses, selectedPokemon, placeholder};
}

// Render display 
function renderDisplay(display, placeholder) {
    display.textContent = placeholder.join(" ");
}

// Render attempts
function renderAttempts(attemptsComp, attempts) {
    attemptsComp.textContent = attempts;
}

// Render guesses
function renderGuesses(guessesComp, guesses) {
    guessesComp.textContent = guesses.length > 0 ? guesses.join(", ") : "None";
}

// Render image
function renderImage(imageComp, selectedPokemon) {
    imageComp.setAttribute("src", selectedPokemon.src);
    imageComp.setAttribute("alt", selectedPokemon.alt);
}

// Render output
function renderOutput(outputComp, output = null) {
    if (output) {
        outputComp.style.display = "block";
        outputComp.textContent = output;
    } else {
        outputComp.style.display = "none";
    }
}

// Render endgame output
function renderEndgame(endgameComp, message = null) {
    if (message) {
        endgameComp.querySelector(".message").textContent = message;
        endgameComp.style.display = "block";
    } else {
        endgameComp.style.display = "none";
    }
}

// Compare and replace
function compareAndReplacePlaceholder(selectedPokemon, userLetter, placeholder, displayH3) {
    // Iterate over pokemon name
    selectedPokemon.name.split("").forEach((letter, i) => {
        // When letter at equal indexes match
        // Add that letter at same index within placeholder
        if (letter === userLetter) placeholder[i] = letter.toUpperCase();
    });
    // Display new placeholder
    renderDisplay(displayH3, placeholder);
}

// Clear display
function clearDisplay(img, display) {
    // Hide img
    img.style.display = "none";
    // Hide display
    display.style.display = "none";
}

// Initiate game
function gameInit() {    
    // Dom selectors
    const {displayH3, attemptsSpan, guessesSpan, image, outputP, endH2} = getDomElements(),
    // Game starting state
    {guesses, selectedPokemon, placeholder} = getGameStartState(getPokemon());
    // Number of attempts
    let attempts = 3,
    // Game over flag
    gameOver = false;
    // Render data
    renderDisplay(displayH3, placeholder);
    renderAttempts(attemptsSpan, attempts);
    renderGuesses(guessesSpan, guesses);
    renderImage(image, selectedPokemon);    
    
    // Play game on keypress
    return function(e) {
        const userLetter = e.key.toLowerCase(),
        // Valid input regex pattern
        pattern = /^[a-z]$/i;
        // When game is not over
        if (!gameOver) {
            // If user letter isn't a-z
            if (!pattern.test(userLetter)) {
                renderOutput(outputP, "That is not a valid letter Pokeball!");
            // When the user guess has not been guessed yet
            } else if (guesses.indexOf(userLetter) === -1) {
                renderOutput(outputP);
                // When the user guess is correct
                if (selectedPokemon.name.indexOf(userLetter) !== -1) {
                    // Iterate over selected pokemon name
                    compareAndReplacePlaceholder(selectedPokemon, userLetter, placeholder, displayH3);
                } else {
                    // Reduce attempts by one and render attempts
                    attempts -= 1;
                    renderAttempts(attemptsSpan, attempts);
                }
                // Add guess to guesses array
                guesses.push(userLetter);
                renderGuesses(guessesSpan, guesses);
            } else {
                // Notify player of duplicate selection
                renderOutput(outputP, "You already threw that letter Pokeball!");
            }
            // Display new guesses
            guessesSpan.textContent = guesses.join(", ");
            // When attempts are expended or pokemon is caught
            if (attempts === 0 || placeholder.join("") === selectedPokemon.name.toUpperCase()) {
                // Set game over
                gameOver = true;
                let message;
                // When attempts (pokeballs) run out
                if (attempts === 0) {
                    // Assign success message
                    message = `${capitalize(selectedPokemon.name)} got away!`;
    
                // When player succeeds (catches pokemon)
                } else {
                    // Assign failure message
                    message = `You caught ${capitalize(selectedPokemon.name)}!`;
                }
                // Clear image & display
                clearDisplay(image, displayH3);
                // Display message
                renderEndgame(endH2, message);
            }
        }
    };
}

// When the html finishes loading
document.addEventListener("DOMContentLoaded", function() {
    // Select play again button
    const playBtn = document.querySelector(".play-btn"),
    // Initialize game
    startGame = gameInit();
    
    // When user presses key
    document.addEventListener("keyup", startGame);

    // When play again button is clicked
    playBtn.addEventListener("click", () => {
        window.location.reload(true);
    });
});
