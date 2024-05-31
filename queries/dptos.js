const conn = require('../connection.js');

async function userExist(data) {
  try { 
    const [results, fields] = await conn.execute('SELECT usuario FROM usuarios WHERE usuario = ?', [data]);
    return results.length > 0 ? true : false;
  } catch (err) {
    console.error('Error en la consulta de userExist:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}


async function createUser(data) {
  try {
    const [results, fields] = await conn.execute('INSERT INTO usuarios (dpto_id, nombre, usuario, pwd, roles, created_at, updated_at, status, tipo, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [data.dpto_id, data.nombre, data.usuario, data.pwd, data.roles, data.created_at, data.updated_at, data.status, data.tipo, data.avatar]);
    return results;
  } catch (err) {
    console.error('Error en la consulta de createUser:', err.message);
    return { error: true, message: err };
  }
}


async function getAll(){
  try {
    const [results, fields] = await conn.execute('SELECT * FROM dptos ORDER BY nombre');

  console.log(results); // results contains rows returned by server
  //console.log(fields); // fields contains extra meta data about results, if available

  return results;
} catch (err) {
  return err;
  console.log(err);
}
}


module.exports = {getAll, createUser, userExist}