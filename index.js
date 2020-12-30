require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear el servidor express
const app =  express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// Directorio público
app.use( express.static('public'));

// Rutas
app.use( '/api/usuarios', require('./routes/usuarios'));
app.use( '/api/login', require('./routes/auth'));
app.use( '/api/alumnos', require('./routes/alumnos'));
app.use( '/api/estados_alumnos', require('./routes/estados_alumnos'));
app.use( '/api/buscar', require('./routes/busquedas'));
app.use( '/api/upload', require('./routes/uploads'));


app.listen(process.env.PORT, () => {
    console.log(`servidor corriendo en el puerto ${ process.env.PORT }`);
});