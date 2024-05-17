//const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config()

//  ####### IMPORT ROUTES #######
const userRoutes = require('./routes/users');
//  ####### FIN IMPORT ROUTES #######

const app = express();
// ####### CAPTURAR BODY
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos


// ## Route middlewares
app.get('/', (req, res) => {
	res.json({
		estado: true,
		mensaje: 'funciona!'
	})
});

app.use('/api/users', userRoutes);




// ###### INICIAR SERVIDOR ######
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`server running on port: ${PORT}`)
})