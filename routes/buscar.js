const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/connection.js');

const { busquedas } = require('../controllers/buscar');

module.exports = () => {
  const router = Router();

  router
    .route('/') //
    .post(busquedas);

  return router;
};
