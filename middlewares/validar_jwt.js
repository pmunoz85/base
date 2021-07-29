const { request } = require('express');
const { comprobarJWT } = require('../funciones/comprobar_jwt');

const validarJWT = async (req = request, res, next) => {
  // Esto es para que se pueda dar de alta a los usuarios cuando no hay ninguno.
  /*
  const usuarios = await db.Users.findAll();
  if (usuarios.length < 1) {
    next();
    return;
  }
  */
  const usuario = await comprobarJWT(req.query.tokenparam);
  if (usuario) {
    req.usuario = usuario;
    req.usuario.autorizado = true;
  }
  next();
};

module.exports = {
  validarJWT,
};
