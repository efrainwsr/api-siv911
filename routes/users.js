const router = require('express').Router();
const Joi = require('@hapi/joi');
const queries = require('../queries/users.js');
const bcrypt = require('bcrypt');

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
        usuario: Joi.string().alphanum().min(4).max(255).required(),
    //email: Joi.string().min(6).max(255).required().email(),
        pwd: Joi.string().min(4).max(1024).required(),
        nombre: Joi.string().min(3).max(255).required()
    })

    const { error } = schemaCreateUser.validate(req.body);

    if(error){
        return res.status(400).json({ 
            error: error.details[0].message
        })
    }

    const userExist = await queries.userExist(req.body.usuario);
    if(userExist){
        return res.status(400).json({
            error: true,
            message: 'Este usuario ya existe!'
        })
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.pwd, salt);

    const data = {
        usuario : req.body.usuario,
        pwd     : password,
        nombre  : req.body.nombre,
    }

    const result = await queries.createUser(data);
    res.json({
        error: false,
        data: result
    })
})


router.post('/login', async (req, res) =>{

    const schemaCredentials = Joi.object({
        usuario: Joi.string().alphanum().min(4).max(25).required(),
        pwd: Joi.string().min(4).max(1024).required(),
    })

    const { error } = await schemaCredentials.validate(req.body);
    
    if(error){
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const userCredentials = await queries.login(req.body.usuario);
    //console.log(userCredentials)

    if(!userCredentials) { return res.status(400).json({
            error: 'Este usuario no existe'
        })
    }

     const validPassword = await bcrypt.compare(req.body.pwd, userCredentials[0].pwd);
     if(!validPassword){ return res.status(200).json({
            error: 'Contraseña incorrecta' 
        })
    }

    res.json({
        error: false,
        data: userCredentials,
        message: "bienvenido"
    })
})


module.exports = router;
