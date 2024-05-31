const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Joi = require('@hapi/joi');
const queries = require('../queries/auth.js');

router.post('/login', async (req, res) => {

    const schemaCredentials = Joi.object({
      usuario: Joi.string().alphanum().min(3).max(25).required(),
      pwd: Joi.string().min(4).max(1024).required()
    });
  
    const { error } = schemaCredentials.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    const userCredentials = await queries.login(req.body.usuario);
    if (userCredentials && userCredentials.error) {
      return res.status(500).json(userCredentials); // Error de conexión a la base de datos
    }
  
    if (!userCredentials) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrecto' });
    }
  
    const validPassword = await bcrypt.compare(req.body.pwd, userCredentials[0].pwd);
    if (!validPassword) {
      return res.status(400).json({ error: true, message: 'Usuario o contraseña incorrecto' });
    }


  
    // Create token
    const token = jwt.sign({
      name: userCredentials[0].nombre,
      user: userCredentials[0].usuario
    }, process.env.TOKEN_SECRET);

    const userInfo = {
      id: userCredentials[0].id,
      usuario: userCredentials[0].usuario,
      nombre: userCredentials[0].nombre,
      roles: [userCredentials[0].roles],
      unidad: userCredentials[0].unidad,
      tipo: userCredentials[0].tipo,
      status: userCredentials[0].status,
      created_at: userCredentials[0].created_at,
      avatar: userCredentials[0].avatar
    }

  
    res.header('auth-token', token).json({
        error: null,
        token: token,
        user: userInfo

    })
    
    
    
    /*res.json({
      error: false,
      data: userCredentials,
      message: "bienvenido",
      token: token
    }); */
  });

module.exports = router;
