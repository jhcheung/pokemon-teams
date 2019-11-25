const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const mainDiv = document.querySelector('main');

fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(trainers => {
        trainers.forEach(function(trainer) {
            renderTrainerCard(trainer);
        })
    })

mainDiv.addEventListener('click', function(event){
    if (event.target.className === "add-pokemon") {
        addPokemon(event.target.dataset.trainerId);
    } else if (event.target.className == "release") {
        releasePokemon(event.target.dataset.pokemonId);
    }
})

function renderTrainerCard(trainer) {
    let trainerHTML = `
        <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
            <button class="add-pokemon" data-trainer-id="${trainer.id}">Add Pokemon</button>
            <ul>
            </ul>
        </div>
    `
    mainDiv.insertAdjacentHTML('beforeend', trainerHTML);
    trainer.pokemons.forEach(function(pokemon) {
        renderPokemon(pokemon);
    });
}

function renderPokemon(pokemon) {
    let pokemonHTML = `
        <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
    `
    let trainerPokemonList = document.querySelector(`[data-id="${pokemon.trainer_id}"] ul`);

    trainerPokemonList.insertAdjacentHTML('beforeend', pokemonHTML);
}


function addPokemon(trainerId) {
    let pokemonConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "trainer_id": parseInt(trainerId)
        })
    }
    fetch(POKEMONS_URL, pokemonConfig)
        .then(response => {
            return response.json();
        })
        .then(pokemon => {
            if (pokemon.error) {
                throw Error(pokemon.error);
            } else {
                renderPokemon(pokemon);
            }
        })
        .catch(function(error) {
            alert(error);
        })
}

function releasePokemon(pokemonId) {
    let releasePokemonURL = POKEMONS_URL + `/${pokemonId}`
    let pokemonConfig = {
        method: 'DELETE',
    }
    fetch(releasePokemonURL, pokemonConfig)
        .then(response => {
            return response.json()
        })
        .then(pokemon => {
            removePokemon(pokemon.id);
        })
        .catch(function(error) {
            alert(error);
        })
}

function removePokemon(pokemonId) {
    let pokemonReleaseButton = document.querySelector(`[data-pokemon-id="${pokemonId}"]`);
    pokemonListItem = pokemonReleaseButton.parentNode;
    pokemonListItem.remove();
}