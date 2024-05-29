import { favoritePokemon } from "../main.js";
let selectedPokemon = null;
let selectedPokemonSprite = null;
const curatedPokemonList = [
  // Add your curated Pokémon IDs or objects here
];

document.addEventListener("DOMContentLoaded", () => {
  const battleContainer = document.getElementById("battle-container");
  const timeToBattleButton = document.getElementById("time-to-battle");
  const closeBattleButton = document.getElementById("close-battle");
  const battleButton = document.getElementById("battle-button");

  function displayFavoritesForSelection() {
    const favoriteSelection = document.getElementById("favorite-selection");
    favoriteSelection.innerHTML = "";
    favoritePokemon.forEach((pokemon) => {
      const button = document.createElement("button");
      button.textContent = capitalizeName(pokemon.name);
      button.classList.add("pokemon-item");
      button.addEventListener("click", (event) =>
        selectPokemon(pokemon, event)
      );
      favoriteSelection.appendChild(button);
    });
  }

  function showBattleContainer() {
    displayFavoritesForSelection();
    battleContainer.style.display = "flex";
  }

  function hideBattleContainer() {
    battleContainer.style.display = "none";
  }

  timeToBattleButton.addEventListener("click", showBattleContainer);
  closeBattleButton.addEventListener("click", hideBattleContainer);
  battleButton.addEventListener("click", battle);

  // The rest of the battle logic functions you provided
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

  function updatePlayerSprite() {
    const playerSprite = document.getElementById("player-sprite");
    playerSprite.src = selectedPokemonSprite;
  }

  function previewSprite(pokemon) {
    const sprite = pokemon.sprites.front_default;
    if (!selectedPokemon) {
      updatePlayerSprite();
    } else {
      selectedPokemonSprite = sprite;
      updatePlayerSprite();
    }
  }

  function hidePreview() {
    if (!selectedPokemon) {
      document.getElementById("player-sprite").src = "questionMark.webp";
    } else {
      document.getElementById("player-sprite").src =
        selectedPokemon.sprites.front_default;
    }
  }

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

  function determineWinner(playerType, enemyType) {
    if (playerType === enemyType) return "It's a tie!";
    if (playerType === "fire" && enemyType === "grass") return "You win!";
    if (playerType === "grass" && enemyType === "water") return "You win!";
    if (playerType === "water" && enemyType === "fire") return "You win!";
    return "You lose!";
  }

  function displayBattle(playerPokemon, enemyPokemon) {
    document.getElementById("player-sprite").src =
      playerPokemon.sprites.front_default;
    document.getElementById("player-name").textContent = playerPokemon.name;
    document.getElementById("enemy-sprite").src =
      enemyPokemon.sprites.front_default;
    document.getElementById("enemy-name").textContent = enemyPokemon.name;
  }

  function getRandomPokemon() {
    const randomIndex = Math.floor(Math.random() * curatedPokemonList.length);
    return pokemonData[randomIndex];
  }
});
