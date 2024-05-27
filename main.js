const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const inputBuscar = document.getElementById('buscarPokemon');
const botonBuscar = document.getElementById('botonBuscar');
const resultadoBusqueda = document.getElementById('resultadoBusqueda');
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function mostrarPokemon(poke){

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonBuscar.addEventListener('click', function() {
    // Obtenemos el valor ingresado por el usuario
    const nombrePokemon = inputBuscar.value.toLowerCase().trim();
    
    // Si el campo de búsqueda está vacío, no hacemos nada
    if (nombrePokemon === '') {
        return;
    }
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Pokemon no encontrado');
        }
        return response.json();
    })
    .then(data => {
        // Mostramos el resultado de la búsqueda en el div resultadoBusqueda
        resultadoBusqueda.innerHTML = `
            <div>
                <p>ID: ${data.id}</p>
                <p>Nombre: ${data.name}</p>
                <img src="${data.sprites.front_default}" alt="${data.name}">
            </div>
        `;
    })
    .catch(error => {
        // Si ocurre un error (por ejemplo, el Pokémon no se encuentra), mostramos un mensaje de error
        resultadoBusqueda.innerHTML = `<p>${error.message}</p>`;
    });
});

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i=1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if (botonId === "ver-todos"){
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))){
                        mostrarPokemon(data);
                    }
                }
            })
    }

}))
