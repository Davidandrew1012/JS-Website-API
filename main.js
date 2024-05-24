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

  let toggleFavorites = false;
  const pokemonIds = [
    1, 2, 3, 44, 45, 70, 71, 102, 103, 114, 7, 8, 9, 61, 79, 87, 99, 116, 130,
    131, 4, 5, 6, 37, 38, 58, 59, 77, 78, 126,
  ];
  const pokemonData = [];
  let favoritePokemon = [];

  async function fetchPokemonData() {
    for (const id of pokemonIds) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      pokemonData.push(data);
    }
    displayPokemon(featuredPokemonContainer, pokemonData);
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
    if (toggleFavorites) {
      if (pokemonData.includes(pokemon)) {
        moveToFavorites(pokemon);
      } else {
        moveToFeatured(pokemon);
      }
    } else {
      showPokemonCard(pokemon);
    }
  }

  function moveToFavorites(pokemon) {
    pokemonData.splice(pokemonData.indexOf(pokemon), 1);
    favoritePokemon.push(pokemon);
    displayPokemon(featuredPokemonContainer, pokemonData);
    displayPokemon(favoriteTeamContainer, favoritePokemon);
  }

  function moveToFeatured(pokemon) {
    favoritePokemon.splice(favoritePokemon.indexOf(pokemon), 1);
    pokemonData.push(pokemon);
    displayPokemon(featuredPokemonContainer, pokemonData);
    displayPokemon(favoriteTeamContainer, favoritePokemon);
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
    const type = types
      .map((type) => type.type.name)
      .find((type) => ["water", "fire", "grass"]);
    if (type === "water") return "fire";
    if (type === "fire") return "grass";
    if (type === "grass") return "water";
    return "none";
  }

  function sortPokemon(list, order) {
    list.sort((a, b) => a.name.localeCompare(b.name) * order);
  }

  function sortPokemonByType(list) {
    const typeOrder = { grass: 1, fire: 2, water: 3 };
    list.sort((a, b) => {
      const aType = a.types
        .map((type) => type.type.name)
        .find((type) => ["grass", "fire", "water"]);
      const bType = b.types
        .map((type) => type.type.name)
        .find((type) => ["grass", "fire", "water"]);
      return (typeOrder[aType] || 4) - (typeOrder[bType] || 4);
    });
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
      ? "Toggle Off"
      : "Toggle Favorites";
  });

  fetchPokemonData();
});
