/* eslint-disable no-underscore-dangle */
/* eslint-disable default-case */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const { request } = require('express');
const db = require('../db/connection.js');
const {roles} = require('../config/roles');

const validarRol = async (req = request, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ msg: 'El usuario no está registrado' });
  }

  try {
    const accesos = await db.UserRol.findAll({
      where: { user_id: req.usuario.id }
    });
    
    if (!accesos) {
      globalThis.alertaGlobal = 'ERROR: Rol no válido, no tiene los permisos adecuados para realizar la acción solicitada (0)';
      console.log(globalThis.alertaGlobal);
      return res.redirect(`/home?tokenparam=${req.query.tokenparam}`);
    }

    const urlBase = req.baseUrl.substring(1,req.baseUrl.length);
    const urlDestino = req._parsedUrl.pathname;
    const urlVerbo = req.method;

    req.usuario.autorizado = false;

    for (const acceso of accesos) {
      const rolesAplicables = roles[acceso.dataValues.rol];

      if (!req.usuario.autorizado) {
        if ((urlBase === 'users' && urlDestino.match(/\/actual/)) || (urlBase === 'users' && urlDestino.match(/\/\d\/actual/))) { 
          req.usuario.autorizado = true;
        }
        else {
          for (const modelo in rolesAplicables) {
            for (const valor of rolesAplicables[modelo]) {
              if (!req.usuario.autorizado) {
                switch (valor) {
                case 'index':
                  if (urlBase === modelo && urlDestino === '/' && urlVerbo === 'GET') { 
                    req.usuario.autorizado = true;
                  }
                  break;
                case 'new': 
                  if ((urlBase === modelo && urlDestino === '/new') || (urlBase === modelo && urlDestino === '/')) { 
                    req.usuario.autorizado = true;
                  }
                  break;
                case 'show':
                  if (urlBase === modelo && urlDestino.match(/\/\d/) && urlVerbo === 'GET') { 
                    req.usuario.autorizado = true;
                  }
                  break;
                case 'edit':
                  if ((urlBase === modelo && urlDestino.match(/\/\d\/edit/)) || (urlBase === modelo && urlDestino.match(/\/\d/))) { 
                    req.usuario.autorizado = true;
                  }
                  break;
                case 'delete':
                  if (urlBase === modelo && urlDestino.match(/\/\d\/delete/)&& urlVerbo === 'POST') { 
                    req.usuario.autorizado = true;
                  }
                  break;
                }
              }
            }
          }
        }
      }
    }

    if (!req.usuario.autorizado) {
      globalThis.alertaGlobal = 'ERROR: Rol no válido, no tiene los permisos adecuados para realizar la acción solicitada (1)';
      console.log(globalThis.alertaGlobal);
      return res.redirect(`/home?tokenparam=${req.query.tokenparam}`);
    }

    next();

  } catch (error) {
    console.log(error);
    globalThis.alertaGlobal = 'ERROR: Rol no válido, no tiene los permisos adecuados para realizar la acción solicitada (2)';
    return res.redirect(`/home?tokenparam=${req.query.tokenparam}`);
  }
};

module.exports = { validarRol };
