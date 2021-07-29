const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/connection.js');
const { validarJWT } = require('../middlewares/validar_jwt');
const { validarRol } = require('../middlewares/validar_rol');
// Este código sirve para poder crear al primer usuario
/*
const validarJWT = (req, res, next) => {
  next();
};
*/
validarNuevoUsuario = [
  validarJWT,
  validarRol,
  check('email', 'El correo electrónico es obligatorio').not().isEmpty(),
  check('email', 'El correo electrónico no es válido').isEmail(),
  check('email').custom(async (email = '') => {
    const existeEmail = await db.Users.findOne({
      where: {
        email,
      },
    });
    if (existeEmail) {
      throw new Error(`El correo electrónico: ${email}, ya está registrado`);
    }
  }),
  check('password', 'El password debe de ser más de 6 letras').isLength({
    min: 6,
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

validarActualizarUsuario = [
  validarJWT,
  validarRol,
  check('email', 'El correo electrónico es obligatorio').not().isEmpty(),
  check('email', 'El correo electrónico no es válido').isEmail(),
  check('password', 'El password debe de ser más de 6 letras').isLength({
    min: 6,
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

const {
  indice,
  nuevo,
  crear,
  editar,
  editarActual,
  actualizar,
  actualizarActual,
  borrar,
  mostrar,
} = require('../controllers/users');

module.exports = () => {
  // const { check } = require('express-validator');

  const router = Router();

  router
    .route('/') //
    .get([validarJWT, validarRol], indice)
    .post(validarNuevoUsuario, crear);
  router
    .route('/new') //
    .get([validarJWT, validarRol], nuevo);
  router
    .route('/actual') //
    .get([validarJWT, validarRol], editarActual);
  router
    .route('/:id/actual') //
    .post([validarJWT, validarRol], actualizarActual);
  router
    .route('/:id') //
    .get([validarJWT, validarRol], mostrar)
    .post(validarActualizarUsuario, actualizar);
  router
    .route('/:id/edit') //
    .get([validarJWT, validarRol], editar);
  router
    .route('/:id/delete') //
    .post([validarJWT, validarRol], borrar);

  return router;
};
