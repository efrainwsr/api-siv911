const conn = require('../connection.js');

async function userExist(data){
  try{ 
    const [results, fields] = await conn.execute('SELECT usuario FROM usuarios WHERE usuario = ?', [data])
    console.log(results, fields, 'user exist' );
    return results.length > 0 ? true : false
  }catch(err){
    console.log(err, 'errr')
  }
}


async function createUser(data){
  try{
    const [results, fields] = await conn.execute(`INSERT INTO usuarios (usuario, pwd, nombre) VALUES (?, ?, ?)`,[data.usuario, data.pwd, data.nombre]);
    return results
  }catch(err){
    console.log(err)
  }
}


async function getAllUsers(){
  try {
    const [results, fields] = await conn.execute('SELECT * FROM usuarios');

  console.log(results); // results contains rows returned by server
  //console.log(fields); // fields contains extra meta data about results, if available

  return results;
} catch (err) {
  return err;
  console.log(err);
}
}

async function login(data){
  try{
    const [results, fields] = await conn.execute('SELECT usuario, nombre, pwd FROM usuarios WHERE usuario = ?', [data]);
    return results.length > 0 ? results : false
  }catch(err){
    console.log(err)
  }
}

module.exports = {getAllUsers, createUser, userExist, login}

//createUser();

//getAllUsers();