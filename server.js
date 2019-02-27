require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const POKEDEX = require('./pokedex.json');

const app = express();

app.use(helmet());

app.use(cors());

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'});
    }
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

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = {error: 'server error'};
    }
    else {
        response = {error}
    }
    res.status(500).json(response);
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
})

