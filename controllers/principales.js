const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const helpers = require('handlebars-helpers')({ handlebars: handlebars });

const db = require('../db/connection.js');
const directorio_vista = '../views/principales/';
const directorio_imagenes = '../public/imagenes/';
const url_imagenes = '/imagenes/';
const array_paginador = require('../helpers/paginador');
const campos_principales = ['id', 'descripcion', 'created_at', 'updated_at'];
const campos_secundarios = [
  'id',
  'principal_id',
  'descripcion',
  'solucion',
  'file_path',
  'created_at',
  'updated_at',
];

// ########################################################
// index
const indice = async (req, res) => {
  const rutaFichero = path.join(__dirname, directorio_vista, 'index.hbs');
  const registros = [];

  const pagina = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = 0 + (pagina - 1) * limit;

  console.log('======= INDICE ==========');

  //const principales = await db.Principales.findAll({
  const principales_count = await db.Principales.findAndCountAll({
    offset: offset,
    limit: limit,
    attributes: campos_principales,
    include: 'secundarios',
  });

  const principales = principales_count.rows;
  const ultima_pagina = Math.ceil(principales_count.count / limit);
  const botones_paginas = array_paginador(pagina, ultima_pagina);

  let secundarios;
  let secundariosDB;

  for (let i = 0; i < principales.length; i += 1) {
    const element = principales[i];

    secundarios = [];
    secundariosDB = await db.Secundarios.findAll({
      where: {
        principal_id: element.dataValues.id,
      },
      attributes: campos_secundarios,
    });

    if (element.secundarios) {
      for (let n = 0; n < secundariosDB.length; n += 1) {
        const elementDB = secundariosDB[n];

        secundarios.push({
          id: elementDB.dataValues.id,
          principal_id: elementDB.dataValues.principal_id,
          descripcion: elementDB.dataValues.descripcion,
          solucion: elementDB.dataValues.solucion ? 'Sí' : 'No',
          file_path: elementDB.dataValues.file_path,
          created_at: elementDB.dataValues.created_at.toLocaleDateString(),
          updated_at: elementDB.dataValues.updated_at.toLocaleDateString(),
        });
      }
    }

    registros.push({
      id: element.dataValues.id,
      descripcion: element.dataValues.descripcion,
      created_at: element.dataValues.created_at.toLocaleDateString(),
      updated_at: element.dataValues.updated_at.toLocaleDateString(),
      secundarios: secundarios,
    });
  }

  res.status(200).render(rutaFichero, {
    registros,
    secundarios,
    alerta: globalThis.alertaGlobal,
    home_active: 'active',
    total_registros: principales_count.count,
    previous_disabled: pagina === 1 ? 'disabled' : '',
    next_disabled: pagina < ultima_pagina ? '' : 'disabled',
    pagina_anterior: pagina - 1,
    pagina_posterior: pagina < ultima_pagina ? pagina + 1 : pagina,
    botones_paginas,
    pagina,
  });
  globalThis.alertaGlobal = '';
};

// ########################################################
// new
const nuevo = (req, res) => {
  console.log('======= NUEVO =========');

  const rutaFichero = path.join(__dirname, directorio_vista, 'new.hbs');
  res
    .status(200)
    .render(rutaFichero, { alerta: globalThis.alertaGlobal, nueva_principal_active: 'active' });
    globalThis.alertaGlobal = '';
};

// create
const crear = async (req, res) => {
  console.log('======= CREAR =========');

  const { descripcion } = req.body;
  const nprincipal = {
    descripcion,
  };

  try {
    const inci = await db.Principales.build(nprincipal);
    const nuevoRegistro = await inci.save();

    globalThis.alertaGlobal = 'La principal ha sido creada correctamente.';
    res.redirect(`/principales/${nuevoRegistro.dataValues.id}`);
  } catch (error) {
    globalThis.alertaGlobal = 'ERROR: no fue posible crear la principal correctamente, vuelva a intentarlo';
    console.log(error);
    res.redirect(`/principales/new`);
  }
};

// ########################################################
// show
const mostrar = async (req, res) => {
  console.log('======= MOSTRAR =========');

  const registros = [];
  const rutaFichero = path.join(__dirname, directorio_vista, 'show.hbs');
  const { id } = req.params;

  const principal = await db.Principales.findOne({
    where: {
      id,
    },
    attributes: campos_principales,
    include: 'secundarios',
  });

  if (principal) {
    let secundariosDB = await db.Secundarios.findAll({
      where: {
        principal_id: principal.dataValues.id,
      },
      attributes: campos_secundarios,
    });

    if (secundariosDB) {
      for (let n = 0; n < secundariosDB.length; n += 1) {
        const elementDB = secundariosDB[n];

        registros.push({
          id: elementDB.dataValues.id,
          principal_id: elementDB.dataValues.principal_id,
          descripcion: elementDB.dataValues.descripcion,
          solucion: elementDB.dataValues.solucion ? 'Sí' : 'No',
          file_path: elementDB.dataValues.file_path,
          created_at: elementDB.dataValues.created_at.toLocaleDateString(),
          updated_at: elementDB.dataValues.updated_at.toLocaleDateString(),
        });
      }
    }
  }

  const uDatos = principal.dataValues;
  res.status(200).render(rutaFichero, { uDatos, registros, alerta: globalThis.alertaGlobal });
  globalThis.alertaGlobal = '';
};

// ########################################################
// edit
const editar = async (req, res) => {
  console.log('======= EDITAR =========');

  const rutaFichero = path.join(__dirname, directorio_vista, 'edit.hbs');
  const { id } = req.params;

  const principal = await db.Principales.findOne({
    where: {
      id,
    },
    attributes: campos_principales,
  });

  const uDatos = principal.dataValues;
  res.status(200).render(rutaFichero, { uDatos, alerta: globalThis.alertaGlobal });
  globalThis.alertaGlobal = '';
};

// update
const actualizar = async (req, res) => {
  console.log('======= ACTUALIZAR =========');

  const { id } = req.params;
  const { descripcion } = req.body;

  db.Principales.findOne({
    where: {
      id,
    },
    attributes: campos_principales,
  })
    .then((registro) => {
      if (!registro) throw new Error('Registro no encontrado');

      const valores = {
        descripcion,
      };

      registro.update(valores).then((actualizado) => {
        globalThis.alertaGlobal = 'principal actualizada correctamente';
        res.redirect(`/principales/${actualizado.id}`);
      });
    })
    .catch((error) => {
      res
        .status(201)
        .json({ msg: 'UPDATE - principales POST con identificador', error });
    });
};

// ########################################################
// delete
const borrar = (req, res) => {
  console.log('======= BORRAR =========');

  const { id } = req.params;

  db.Principales.destroy({
    where: {
      id,
    },
  })
    .then(async () => {
      await db.Secundarios.destroy({
        where: {
          principal_id: id,
        },
      });

      globalThis.alertaGlobal = 'La principal se ha borrado correctamente';
      res.redirect(`/principales`);
    })
    .catch((error) => {
      res.status(201).json({
        msg: 'DELETE - principales DELETE con identificador',
        error,
      });
    });
};

// ########################################################
// new action
const nuevaActuacion = (req, res) => {
  const rutaFichero = path.join(__dirname, directorio_vista, 'new_action.hbs');
  const principalID = req.params.id;
  res.status(200).render(rutaFichero, { principalID });
};

// create action
const crearActuacion = async (req, res) => {
  const principalID = req.params.id;
  const { descripcion } = req.body;
  let nActuacion = {};

  if (req.files) {
    const file = req.files.file;
    const fecha_actual = String(Date.now());
    const nombre_fichero = file.name.replace(/\s|#|-|@|<>/g, '_');

    const rutaRelativa = path.join(url_imagenes, principalID, fecha_actual);

    const rutaSubida = path.join(
      __dirname,
      directorio_imagenes,
      principalID,
      fecha_actual
    );

    if (!fs.existsSync(rutaSubida)) {
      fs.mkdirSync(rutaSubida, {
        recursive: true,
      });
    }

    const nombreCompleto = rutaSubida + '/' + nombre_fichero;
    const nombreRelativo = rutaRelativa + '/' + nombre_fichero;

    file.mv(nombreCompleto, async (error) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .send(JSON.stringify({ estatus: 'error', message: error }));
      }
      nActuacion = {
        principal_id: principalID,
        descripcion,
        file_path: nombreRelativo,
      };

      try {
        const act = await db.Secundarios.build(nActuacion);
        await act.save();

        globalThis.alertaGlobal = 'Actuación creada correctamente';
        res.redirect(`/principales/${principalID}`);
      } catch (error) {
        res.status(201).json({ msg: 'CREATE - secundarios POST', error });
      }
    });
  } else {
    nActuacion = {
      principal_id: principalID,
      descripcion,
    };
    try {
      const act = await db.Secundarios.build(nActuacion);
      await act.save();

      globalThis.alertaGlobal = 'Actuación creada correctamente';
      res.redirect(`/principales/${principalID}`);
    } catch (error) {
      res.status(201).json({ msg: 'CREATE - secundarios POST', error });
    }
  }
};

// ########################################################
// edit action
const editarActuacion = async (req, res) => {
  const rutaFichero = path.join(__dirname, directorio_vista, 'edit_action.hbs');
  const { id } = req.params;

  const secundarios = await db.Secundarios.findOne({
    where: {
      id,
    },
    attributes: campos_secundarios,
  });

  const uDatos = secundarios.dataValues;
  res.status(200).render(rutaFichero, { uDatos, alerta: globalThis.alertaGlobal });
  globalThis.alertaGlobal = '';
};

// update action
const actualizarActuacion = async (req, res) => {
  const { id } = req.params;
  const { descripcion, solucion } = req.body;

  const solucion_entero = solucion === 'on' ? 1 : 0; ///////////////////////// Esto hay que cambiarlo

  db.Secundarios.findOne({
    where: {
      id,
    },
    attributes: campos_secundarios,
  })
    .then((registro) => {
      if (!registro) throw new Error('Registro no encontrado');

      const valores = {
        descripcion,
        solucion: solucion_entero,
      };

      registro.update(valores).then((actualizado) => {
        globalThis.alertaGlobal = 'Actuación actualizada correctamente';
        res.redirect(`/principales/${registro.principal_id}`);
      });
    })
    .catch((error) => {
      res
        .status(201)
        .json({ msg: 'UPDATE - secundarios POST con identificador', error });
    });
};

// ########################################################
// delete action
const borrarActuacion = (req, res) => {
  const { id, principalID } = req.params;

  db.Secundarios.destroy({
    where: {
      id,
    },
  })
    .then(async (reg) => {
      globalThis.alertaGlobal = 'Actuación borrada correctamentes';
      res.redirect(`/principales/${principalID}`);
    })
    .catch((error) => {
      res.status(201).json({
        msg: 'DELETE - principales DELETE con identificador',
        error,
      });
    });
};

module.exports = {
  indice,
  nuevo,
  crear,
  editar,
  actualizar,
  mostrar,
  borrar,
  nuevaActuacion,
  crearActuacion,
  editarActuacion,
  actualizarActuacion,
  borrarActuacion,
};
