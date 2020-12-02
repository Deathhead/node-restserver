require('./config/config');
// Using Node.js `require()`
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Configuracion global de rutas
app.use(require('./routes/index'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
})

//comentado xdvsd