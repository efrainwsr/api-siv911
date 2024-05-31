const conn = require('../connection.js');

async function login(usuario) {
  try {
    const [results, fields] = await conn.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return results.length > 0 ? results : null;
  } catch (err) {
    console.error('Error en la consulta de login:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}

module.exports = {login};