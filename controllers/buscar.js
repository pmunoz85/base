const path = require('path');
const { Op, col } = require('sequelize');
const db = require('../db/connection.js');
const directorio_vista = '../views/buscar/';
const campos_incidencias = ['id', 'descripcion', 'created_at', 'updated_at'];
const campos_actuaciones = [
  'id',
  'incidencia_id',
  'descripcion',
  'solucion',
  'created_at',
  'updated_at',
];

// ########################################################
// buscar
const busquedas = async (req, res) => {
  const rutaFichero = path.join(__dirname, directorio_vista, 'busqueda.hbs');
  const { busqueda } = req.body;
  const palabras = busqueda.split(' ');

  const busqueda_compuesta = [];
  const registros = [];
  let filtro = {};

  console.log('======= buscar indice ========');

  if (palabras.length === 1) {
    filtro = { descripcion: { [Op.iLike]: `%${busqueda}%` } };
  } else {
    for (let n = 0; n < palabras.length; n++) {
      busqueda_compuesta.push({
        descripcion: { [Op.iLike]: `%${palabras[n]}%` },
      });
    }
    filtro = { [Op.and]: busqueda_compuesta };
  }

  const ids = [];

  const incidencias_previas = await db.Incidencias.findAll({
    attributes: campos_incidencias,
    where: filtro,
  });

  const actuaciones_previas = await db.Actuaciones.findAll({
    attributes: campos_actuaciones,
    where: filtro,
  });

  for (let i = 0; i < incidencias_previas.length; i++) {
    ids.push(incidencias_previas[i].dataValues.id);
  }

  for (let i = 0; i < actuaciones_previas.length; i++) {
    ids.push(actuaciones_previas[i].dataValues.incidencia_id);
  }

  const incidencias = await db.Incidencias.findAll({
    attributes: campos_incidencias,
    include: 'actuaciones',
    where: { id: ids },
  });

  let actuaciones;
  let actuacionesDB;

  for (let i = 0; i < incidencias.length; i += 1) {
    const element = incidencias[i];

    actuaciones = [];
    actuacionesDB = await db.Actuaciones.findAll({
      where: {
        incidencia_id: element.dataValues.id,
      },
      attributes: campos_actuaciones,
    });

    if (element.actuaciones) {
      for (let n = 0; n < actuacionesDB.length; n += 1) {
        const elementDB = actuacionesDB[n];

        actuaciones.push({
          id: elementDB.dataValues.id,
          incidencia_id: elementDB.dataValues.incidencia_id,
          descripcion: resaltarTexto(
            elementDB.dataValues.descripcion,
            palabras
          ),
          solucion: elementDB.dataValues.solucion ? 'Sí' : 'No',
          created_at: elementDB.dataValues.created_at.toLocaleDateString(),
          updated_at: elementDB.dataValues.updated_at.toLocaleDateString(),
        });
      }
    }

    registros.push({
      id: element.dataValues.id,
      descripcion: resaltarTexto(element.dataValues.descripcion, palabras),
      created_at: element.dataValues.created_at.toLocaleDateString(),
      updated_at: element.dataValues.updated_at.toLocaleDateString(),
      actuaciones: actuaciones,
    });
  }

  globalThis.alertaGlobal = `Cadenas para los parámetros de búsqueda => ${palabras}`;
  res.status(200).render(rutaFichero, { registros, actuaciones, alerta });
  globalThis.alertaGlobal = '';
};

const resaltarTexto = (texto, array) => {
  let resaltado = '';
  let cadena = texto;
  let posicion_ini = -1;

  for (let n = 0; n < array.length; n++) {
    const element = array[n];
    const regEx = new RegExp(element, 'i');

    posicion_ini = cadena.search(regEx);
    while (posicion_ini !== -1) {
      resaltado += `${cadena.substring(
        0,
        posicion_ini
      )}<span style="background-color: #fff933;">${cadena.substring(
        posicion_ini,
        posicion_ini + element.length
      )}</span>`;
      cadena = cadena.substring(posicion_ini + element.length, cadena.length);
      posicion_ini = cadena.search(regEx);
    }
    cadena = resaltado + cadena;
  }

  return cadena;
};

const resaltarTexto_ESTA_OBSOLETO = (texto, array) => {
  let resaltado = texto;

  for (let n = 0; n < array.length; n++) {
    const element = array[n];
    const regEx = new RegExp(element, 'ig');

    resaltado = resaltado.replace(
      regEx,
      `<span style="background-color: #fff933;">${element}</span>`
    );
    console.log(regEx);
  }

  return resaltado;
};

module.exports = {
  busquedas,
};
