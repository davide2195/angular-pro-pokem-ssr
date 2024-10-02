// /pokemons/1
// /pokemons/2
// /pokemons/3
// /pokemons/4
// /pokemons/5
// /pokemons/page/1
// /pokemons/page/2
// /pokemons/page/3
// /pokemons/page/4
// /pokemons/page/5
// /pokemons/kingdra

const TOTAL_POKEMONS = 150;
const TOTAL_PAGES = 5;

( async () => {

    const fs = require('fs')

    // Pokemons por Ids
    const pokemonIds = Array.from( { length: TOTAL_POKEMONS },( _, i ) => i +1 );
    let fileContent = pokemonIds.map(
        id => `/pokemons/${ id }`
    ).join( '\n' )


    // Paginas
    for (let index = 1; index <= TOTAL_PAGES; index++) {
        fileContent += `\n/pokemons/page/${ index }`        
    }

    // Por nombres de pokemons
    const pokemonNameList = await fetch ( `https://pokeapi.co/api/v2/pokemon?limit=${ TOTAL_POKEMONS}`)
      .then( res => res.json() );

      fileContent += '\n';
      fileContent += pokemonNameList.results.map(
        pokemon => `/pokemons/${ pokemon.name }`
      ).join('\n');

    fs.writeFileSync('routes.txt', fileContent);   

} )();

