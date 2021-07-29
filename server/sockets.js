const db = require('../db/connection.js');
const { comprobarJWT } = require('../funciones/comprobar_jwt');

const socketController = (socket) => {
  console.log('Cliente contectado con del ID:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado con el ID:', socket.id);
  });

  socket.on('mensaje', (payload, callback) => {
    if (callback) {
      callback(socket.id);
    }
    socket.broadcast.emit('mensaje', payload);
  });

  socket.on('guardarRoles', async (payload, callback) => {
    const {usuarioID, token} = payload;
    let {rolesParaGuardar} = payload;
    
    await comprobarJWT(token);

    if (callback) {
      let guardado = false;

      db.UserRol.findAll({
        where: {
          user_id: usuarioID,
        },
        attributes: ['id', 'user_id', 'rol'],
      }).then((registros) => {
        for (const registro of registros) {
          if (rolesParaGuardar.includes(registro.rol)) {
            rolesParaGuardar = rolesParaGuardar.filter(item => item !== registro.rol);
          }
          else if (borrarRol(registro.id)) {
            throw new Error('ERROR: no fue posible modificar los roles del usuario correctamente, vuelva a intentarlo');
          }
        }
        for (const rol of rolesParaGuardar) {
          if (darDeAltaElNuevoRol(usuarioID, rol)) {
            throw new Error('ERROR: no fue posible modificar los roles del usuario correctamente, vuelva a intentarlo');
          }
        }
      }).catch((error) => {
        globalThis.alertaGlobal =  'ERROR: no fue posible modificar los roles del usuario correctamente, vuelva a intentarlo';
        console.log(error);
        guardado = false;
      });

      callback(socket.id, guardado);
    }
  });
};

const borrarRol = (id) => {
  let resultado = false;
  db.UserRol.destroy({
    where: {
      id,
    },
  }).then(() => {
    console.log(`Registro BORRADO con el ID = ${id}`);
    resultado = true;
  }).catch((error) => {
    console.log(error);
    resultado = false;
  });
  return resultado;
}

const darDeAltaElNuevoRol = (userID, rol) => {
  let resultado = false;
  const newRol = { user_id: userID, rol };

  db.UserRol.create(newRol).then(() => {
    resultado = true;
  }).catch( (error) => {
    console.log(error);
    resultado = false;
  });
  return resultado;
}

module.exports = {
  socketController,
};
