// Select Pokémon
function selectPokemon(pokemon, event) {
  selectedPokemon = pokemon;
  selectedPokemonSprite = pokemon.sprites.front_default;
  updatePlayerSprite();
  document
    .querySelectorAll(".pokemon-item")
    .forEach((item) => item.classList.remove("selected"));
  event.target.classList.add("selected");
  document.getElementById("battle-button").disabled = false;
}

// Update player's Pokémon sprite
function updatePlayerSprite() {
  const playerSprite = document.getElementById("player-sprite");
  playerSprite.src = selectedPokemonSprite;
}

// Preview the sprite
function previewSprite(pokemon) {
  const sprite = pokemon.sprites.front_default;
  if (!selectedPokemon) {
    updatePlayerSprite();
  } else {
    selectedPokemonSprite = sprite;
    updatePlayerSprite();
  }
}

// Hide sprite preview
function hidePreview() {
  if (!selectedPokemon) {
    document.getElementById("player-sprite").src = "questionMark.webp";
  } else {
    document.getElementById("player-sprite").src =
      selectedPokemon.sprites.front_default;
  }
}

// Battle logic
function battle() {
  const resultDiv = document.getElementById("result");

  if (!selectedPokemon) {
    resultDiv.textContent = "Please select a Pokémon before battling.";
    resultDiv.style.color = "black"; // Default color
    return;
  }

  const enemyPokemon = getRandomPokemon();
  const playerType = selectedPokemon.types[0].type.name;
  const enemyType = enemyPokemon.types[0].type.name;

  const result = determineWinner(playerType, enemyType);

  displayBattle(selectedPokemon, enemyPokemon); // Display player and enemy sprites
  resultDiv.textContent = `You chose ${selectedPokemon.name}, Enemy chose ${enemyPokemon.name}. ${result}`;

  // Change color based on result
  if (result === "You win!") {
    resultDiv.style.color = "green";
  } else if (result === "You lose!") {
    resultDiv.style.color = "red";
  } else {
    resultDiv.style.color = "black"; // Default color
  }
}

// Determine winner
function determineWinner(playerType, enemyType) {
  if (playerType === enemyType) return "It's a tie!";
  if (playerType === "fire" && enemyType === "grass") return "You win!";
  if (playerType === "grass" && enemyType === "water") return "You win!";
  if (playerType === "water" && enemyType === "fire") return "You win!";
  return "You lose!";
}

// Display the battle
function displayBattle(playerPokemon, enemyPokemon) {
  document.getElementById("player-sprite").src =
    playerPokemon.sprites.front_default;
  document.getElementById("player-name").textContent = playerPokemon.name;
  document.getElementById("enemy-sprite").src =
    enemyPokemon.sprites.front_default;
  document.getElementById("enemy-name").textContent = enemyPokemon.name;
}

// Get random Pokémon
function getRandomPokemon() {
  const randomIndex = Math.floor(Math.random() * curatedPokemonList.length);
  return pokemonData[randomIndex];
}

document.getElementById("battle-button").addEventListener("click", battle);
