const morgan = require('morgan');
const express = require('express');

const app = express();

app.use(morgan('dev'));

app.use((req, res) => {
    res.send('Hello, world!')
})

const PORT = 8000;

app.listen(PORT, () => {
    console.log('Server listening at port 8000')
})

