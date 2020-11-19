require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path') // Este paquete forma parte de Node, y nos da el path en el que se encuentra el proyecto

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public para que se pueda acceder desde cualquier lugar
app.use(express.static(path.resolve(__dirname, '../public'))); // Tomamos el path del proyecto y le añadimos la carpeta que queremos utilizar

// Configuración global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
})