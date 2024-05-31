const router = require('express').Router();
const Joi = require('@hapi/joi');
const queries = require('../queries/users.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


router.post('/getAllUsers', async (req, res) => {

    const result = await queries.getAllUsers();
    //console.log(result);
    
    res.json({
        error: false,
        data: result
    })
})


router.post('/createUser', async (req, res) =>{
    const schemaCreateUser = Joi.object({
        dpto_id: Joi.number().min(1).required(),
        nombre: Joi.string().min(3).max(25).required(),
        usuario: Joi.string().alphanum().min(3).max(25).required(),
        pwd: Joi.string().min(4).max(1024).required(),
        roles: Joi.required(),
        created_at: Joi.string().required(),
        updated_at: Joi.string(),
        status: Joi.string().required(),
        tipo: Joi.string().required(),
        avatar: Joi.string()
    })
    
    const { error } = schemaCreateUser.validate(req.body);
    
    if(error){
        return res.status(400).json({ 
            error: error.details[0].message
        })
    }
    
    const userExist = await queries.userExist(req.body.usuario);
    if (userExist && userExist.error) {
        return res.status(500).json(userExist); // Error de conexión a la base de datos
    }
    
    if (userExist) {
        return res.status(400).json({ error: true, message: 'Este usuario ya existe!' });
    }
    
    //const userExist = await queries.userExist(req.body.usuario);
    
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.pwd, salt);
    
    const data = {
        dpto_id: req.body.dpto_id,
        nombre : req.body.nombre,
        usuario : req.body.usuario,
        pwd     : password,
        roles  : req.body.roles,
        created_at: req.body.created_at ,
        updated_at: req.body.updated_at,
        status: req.body.status,
        tipo  : req.body.tipo,
        avatar: req.body.avatar,
    }
    

    const result = await queries.createUser(data);
    res.json({
        error: false,
        data: result
    })
})


/*router.post('/login', async (req, res) => {
    const schemaCredentials = Joi.object({
      usuario: Joi.string().alphanum().min(4).max(25).required(),
      pwd: Joi.string().min(4).max(1024).required(),
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
  
    res.header('auth-token', token).json({
        error: null,
        data: userCredentials
    })
  
  });  */

module.exports = router;
