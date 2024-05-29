document.addEventListener("DOMContentLoaded", () => {
  const featuredPokemonContainer = document.getElementById("featured-pokemon");
  const favoriteTeamContainer = document.getElementById("favorite-team");
  const pokemonCard = document.getElementById("pokemon-card");
  const toggleFavoritesButton = document.getElementById("toggle-favorites");
  const sortFeaturedButton = document.getElementById("sort-featured");
  const sortFeaturedTypeButton = document.getElementById("sort-featured-type");
  const sortFavoritesButton = document.getElementById("sort-favorites");
  const sortFavoritesTypeButton = document.getElementById(
    "sort-favorites-type"
  );
  const totalFeaturedSpan = document.getElementById("total-featured");
  const totalFavoritesSpan = document.getElementById("total-favorites");
  const grassFavoritesSpan = document.getElementById("grass-favorites");
  const fireFavoritesSpan = document.getElementById("fire-favorites");
  const waterFavoritesSpan = document.getElementById("water-favorites");

  let toggleFavorites = false;
  const pokemonIds = [
    1, 2, 3, 44, 45, 70, 71, 102, 103, 114, 7, 8, 9, 61, 79, 87, 99, 116, 130,
    131, 4, 5, 6, 37, 38, 58, 59, 77, 78, 126,
  ];
  let pokemonData = [];
  let favoritePokemon = [];

  async function fetchPokemonData() {
    try {
      const promises = pokemonIds.map(async (id) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      });
      pokemonData = await Promise.all(promises);
      displayPokemon(featuredPokemonContainer, pokemonData);
      updateTallies();
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  }

  function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function displayPokemon(container, pokemonList) {
    container.innerHTML = "";
    pokemonList.forEach((pokemon) => {
      const button = document.createElement("button");
      button.textContent = capitalizeName(pokemon.name);
      button.className =
        pokemon.types
          .map((type) => type.type.name)
          .find((type) => ["water", "fire", "grass"]) || "";
      button.addEventListener("click", () => handlePokemonClick(pokemon));
      container.appendChild(button);
    });
  }

  function handlePokemonClick(pokemon) {
    if (!toggleFavorites) {
      showPokemonCard(pokemon);
    } else {
      if (favoritePokemon.includes(pokemon)) {
        moveToFeatured(pokemon);
      } else {
        moveToFavorites(pokemon);
      }
    }
  }

  function moveToFavorites(pokemon) {
    favoritePokemon.push(pokemon);
    pokemonData = pokemonData.filter((p) => p !== pokemon);
    displayPokemon(featuredPokemonContainer, pokemonData);
    displayPokemon(favoriteTeamContainer, favoritePokemon);
    updateTallies();
  }

  function moveToFeatured(pokemon) {
    pokemonData.push(pokemon);
    favoritePokemon = favoritePokemon.filter((p) => p !== pokemon);
    displayPokemon(featuredPokemonContainer, pokemonData);
    displayPokemon(favoriteTeamContainer, favoritePokemon);
    updateTallies();
  }

  function showPokemonCard(pokemon) {
    pokemonCard.innerHTML = `
            <h3>${capitalizeName(pokemon.name)}</h3>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Type: ${pokemon.types
              .map((type) => capitalizeName(type.type.name))
              .join(", ")}</p>
            <p>Advantage against: ${capitalizeName(
              getAdvantage(pokemon.types)
            )}</p>
        `;
  }

  function getAdvantage(types) {
    const advantages = {
      water: "fire",
      fire: "grass",
      grass: "water",
    };
    const typeAdvantages = types.map((type) => advantages[type.type.name]);
    return (
      typeAdvantages.filter((advantage) => advantage !== undefined)[0] || "none"
    );
  }

  function updateTallies() {
    totalFeaturedSpan.textContent = pokemonData.length;
    totalFavoritesSpan.textContent = favoritePokemon.length;
    const grassCount = favoritePokemon.filter((pokemon) =>
      pokemon.types.map((type) => type.type.name).includes("grass")
    ).length;
    const fireCount = favoritePokemon.filter((pokemon) =>
      pokemon.types.map((type) => type.type.name).includes("fire")
    ).length;
    const waterCount = favoritePokemon.filter((pokemon) =>
      pokemon.types.map((type) => type.type.name).includes("water")
    ).length;
    grassFavoritesSpan.textContent = grassCount;
    fireFavoritesSpan.textContent = fireCount;
    waterFavoritesSpan.textContent = waterCount;
  }

  sortFeaturedButton.addEventListener("click", () => {
    const order = sortFeaturedButton.textContent.includes("A-Z") ? 1 : -1;
    sortPokemon(pokemonData, order);
    displayPokemon(featuredPokemonContainer, pokemonData);
    sortFeaturedButton.textContent = order === 1 ? "Sort Z-A" : "Sort A-Z";
  });

  sortFeaturedTypeButton.addEventListener("click", () => {
    sortPokemonByType(pokemonData);
    displayPokemon(featuredPokemonContainer, pokemonData);
  });

  sortFavoritesButton.addEventListener("click", () => {
    const order = sortFavoritesButton.textContent.includes("A-Z") ? 1 : -1;
    sortPokemon(favoritePokemon, order);
    displayPokemon(favoriteTeamContainer, favoritePokemon);
    sortFavoritesButton.textContent = order === 1 ? "Sort Z-A" : "Sort A-Z";
  });

  sortFavoritesTypeButton.addEventListener("click", () => {
    sortPokemonByType(favoritePokemon);
    displayPokemon(favoriteTeamContainer, favoritePokemon);
  });

  toggleFavoritesButton.addEventListener("click", () => {
    toggleFavorites = !toggleFavorites;
    toggleFavoritesButton.textContent = toggleFavorites
      ? "Toggle Pokemon Stats"
      : "Toggle Favorites";
    toggleFavoritesButton.className = toggleFavorites
      ? "toggle-on"
      : "toggle-off";
  });

  toggleFavoritesButton.className = "toggle-off";

  fetchPokemonData();
});
