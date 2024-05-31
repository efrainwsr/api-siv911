const router = require('express').Router();
const Joi = require('@hapi/joi');
const queries = require('../queries/dptos.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


router.post('/getAll', async (req, res) => {

    const result = await queries.getAll();
    console.log(result);
    
    res.json({
        error: false,
        result
    })
})


router.post('/createUser', async (req, res) =>{
    const schemaCreateUser = Joi.object({
        dpto_id: Joi.number().min(1).required(),
        nombre: Joi.string().min(3).max(25).required(),
        usuario: Joi.string().alphanum().min(3).max(25).required(),
        pwd: Joi.string().min(4).max(1024).required(),
        roles: Joi.string().required(),
        created_at: Joi.string().required(),
        updated_at: Joi.string().required(),
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

module.exports = router;
