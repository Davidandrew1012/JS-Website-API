const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";
const curatedPokemonList = [
  1, 2, 3, 44, 45, 70, 71, 102, 103, 114, 7, 8, 9, 61, 79, 87, 99, 116, 130,
  131, 4, 5, 6, 37, 38, 58, 59, 77, 78, 126,
];
let selectedPokemon = null;
let pokemonData = [];
let selectedPokemonSprite = "questionMark.webp"; // Default sprite

// Function to show the action container
function showActionContainer() {
  const actionContainer = document.querySelector(".action-container");
  actionContainer.style.display = "block"; // Show the action container
}

// Event listener for the "Time To Battle!" option in the navbar
document
  .getElementById("battle-time")
  .addEventListener("click", showActionContainer);

// Event listener for the "Time To Battle!" option in the navbar

// Fetch curated Pokémon
async function fetchPokemon() {
  let pokemonPromises = [];
  curatedPokemonList.forEach((pokemon) => {
    pokemonPromises.push(
      fetch(`${POKEAPI_URL}${pokemon}/`).then((response) => response.json())
    );
  });
  return Promise.all(pokemonPromises);
}

// Display Pokémon list
async function displayPokemonList() {
  const pokemonList = document.getElementById("pokemon-list");
  pokemonData = await fetchPokemon();

  pokemonData.forEach((pokemon) => {
    const div = document.createElement("div");
    div.classList.add("pokemon-item");
    div.textContent =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    // Add CSS class based on the primary type
    const type = pokemon.types[0].type.name;
    div.classList.add(type);

    // Preview the sprite on hover
    div.addEventListener("mouseover", () => previewSprite(pokemon));

    // Select Pokémon on click
    div.addEventListener("click", () => selectPokemon(pokemon));

    pokemonList.appendChild(div);
  });
}

// Select Pokémon
function selectPokemon(pokemon) {
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

// Battle logic
// Battle logic
function battle() {
  // Show the action container
  showActionContainer();

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

displayPokemonList();
