## CREAR NUEVA RUTA

### PRIMERO
- /routes: nuevo archivo con las rutas finales, configuracion y validacion 
- Objeto joi para validar
- devolver status 400 si Joi devuelve error
- otras validaciones
- crear objeto con los datos a enviar a la consulta

### SEGUNDO
- /queries: Nuevo archivo con las consultas a ejecutar contra la base de datos
- INSERSION BASE NORMAL:
		`	async function createUser(data) {
			  try {
			    const [results, fields] = await conn.execute('INSERT INTO usuarios (campo1, campo2) VALUES (?, ?)',
			    [data.dpto_id, data.nombre]);
			    return results;
			  } catch (err) {
			    console.error('Error en la consulta de NOMBRE DE LA CONSULTA:', err.message);
			    return { error: true, message: err };
			  }
			}
		`
- module.exports = {funciones, otra}

### TERCERO
- importar archivo de rutas `const userRoutes = require('./routes/users');`
- importar `app.use('/api/users', validToken, userRoutes);`
- 
