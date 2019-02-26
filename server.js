require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const POKEDEX = require('./pokedex.json');

const app = express();

app.use(morgan('dev'));

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'});
    }
    console.log('validate bearer token middleware')
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychich`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {
    res.json(validTypes);
}

function handleGetPokemon(req, res) {
    const {name, type} = req.query;
    let results = POKEDEX.pokemon

    if (name) {
        results = results.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(name.toLowerCase())
        })
    }

    if (type) {
        results = results.filter(pokemon => {
            return pokemon.type.includes(type)
        })
    }
    res.json(results)
}

app.get('/pokemon', handleGetPokemon)

app.get('/types', handleGetTypes)

const PORT = 8000;

app.listen(PORT, () => {
    console.log('Server listening at port 8000')
})

