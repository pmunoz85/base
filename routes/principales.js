const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/connection.js');

const {
  indice,
  nuevo,
  crear,
  editar,
  actualizar,
  borrar,
  mostrar,
  nuevaActuacion,
  crearActuacion,
  editarActuacion,
  actualizarActuacion,
  borrarActuacion,
} = require('../controllers/principales');

module.exports = () => {
  const router = Router();

  router
    .route('/') //
    .get(indice)
    .post(crear);
  router
    .route('/new') //
    .get(nuevo);
  router
    .route('/:id') //
    .get(mostrar)
    .post(actualizar);
  router
    .route('/:id/edit') //
    .post(editar);
  router
    .route('/:id/delete') //
    .post(borrar);
  router
    .route('/actuaciones/:id/new') //
    .get(nuevaActuacion)
    .post(crearActuacion);
  router
    .route('/actuaciones/:id/edit') //
    .get(editarActuacion)
    .post(actualizarActuacion);
  router
    .route('/actuaciones/:id/delete/:incidenciaID') //
    .get(borrarActuacion);

  return router;
};
