const path = require('path');

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar_jwt');

module.exports = () => {
  const router = Router();

  router
    .route('/') //
    .get(validarJWT, (req, res) => {
      const rutaFichero = path.join(__dirname, '../views/home/', 'home.hbs');
      res.status(200).render(rutaFichero, {
        alerta: globalThis.alertaGlobal,
        home_active: 'active',
        id_usuario: req.usuario.id,
        email_usuario: req.usuario.email,
      });
      globalThis.alertaGlobal = '';
    });

  return router;
};
