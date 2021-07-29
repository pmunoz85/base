const path = require('path');
const bcryptjs = require('bcryptjs');
const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const { validarJWT } = require('../middlewares/validar_jwt');
const { generarJWT } = require('../helpers/generar_jwt');
const db = require('../db/connection.js');

const campos = ['id', 'email', 'encrypted_password', 'createdAt', 'updatedAt'];
const __usuario = {email: '', password: ''};

const existeEmail = async (email) => {
  __usuario.email = email;
  try {
    const usuario = await db.Users.findOne({ where: { email } });
    if (!usuario) {
      return Promise.reject( 'El usuario o la contraseña son incorrectos');
    }
  } catch (error) {
    console.log(error);
    return Promise.reject('Tenemos algún problema con la identificación del usuario. Por favor, póngase en contacto con el administrador');
  }
};

const validarPassword = async (password) => {
  __usuario.password = password;
  try {
    const usuario = await db.Users.findOne({ where: { email: __usuario.email } });
    const validPassword = bcryptjs.compareSync(password, usuario.encrypted_password);
    if (!validPassword) {
      return Promise.reject('El usuario o la contraseña son incorrectos');
    }
  } catch (error) {
    console.log(error);
    return Promise.reject('El usuario no existe');
  }
};

const elEmailYaExiste = async (email) => {
  try {
    const usuario = await db.Users.findOne({ where: { email } });

    if (usuario) {
      return Promise.reject('El email ya está siendo utilizado');
    }
  } 
  catch (error) {
    console.log(error);
    return Promise.reject('Tenemos algún problema con la identificación del usuario. Por favor, póngase en contacto con el administrador');
  }
};

const verificarLogin = [
  check('email', 'El correo electrónico es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  check('email').custom(existeEmail),
  check('password').custom(validarPassword),
  (req, res, next) => {
    const errors = validationResult(req);
    errors.array().map((elem) => {
      globalThis.arrayAlertaGlobal.push(elem.msg); 
    });
    
    if (!errors.isEmpty()) 
      return res.status(422).json({ errors: errors.array() });
    
    next();
  },
];

const verificarPreReset = [
  validarJWT,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
  
const verificarReset = [
  validarJWT,
  check('password', 'Necesita aportar la contraseña').not().isEmpty(),
  check('repetir_password', 'Debe aportar la contraseña repetida').not().isEmpty(),
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
  
const verificarSingin = [
  check('email', 'El correo electrónico es obligatorio').isEmail(),
  check('password', 'Necesita aportar la contraseña').not().isEmpty(),
  check('repetir_password', 'Debe aportar la contraseña repetida').not().isEmpty(),
  check('repetir_password', 'Las contraseñas deben coincidir').custom(( value, { req } ) => { value === req.body.password}),
  check('email').custom(elEmailYaExiste),
  (req, res, next) => {
    const errors = validationResult(req);
    errors.array().map((elem) => {
      globalThis.arrayAlertaGlobal.push(elem.msg); 
    });
    
    if (!errors.isEmpty()) 
      return res.status(422).json({ errors: errors.array() });
    
    next();
  },
];

const crearUsuario = async (u) => {
  const nUsuario = {
    email: u.email,
    encrypted_password: bcryptjs.hashSync(u.password, 10),
  };

  try {
    await db.Users.build(nUsuario).save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = () => {
  const router = Router();

  router
    .route('/')
    .get((req, res) => {
      res.status(200).render(path.join(__dirname, '../views/login/', 'login.hbs'), { alerta: globalThis.alertaGlobal, a_alertas: globalThis.arrayAlertaGlobal, layout: '' });
      globalThis.arrayAlertaGlobal = [];
      globalThis.alertaGlobal = '';
    })
    .post(verificarLogin, async (req, res) => {
      generarJWT(__usuario).then((token) => {
        res.status(200).json({ token });
      });
    });

  router
    .route('/singin')
    .post(verificarSingin, async (req, res) => {
      const usuario = {email: req.body.email, password: req.body.password };
      crearUsuario(usuario);
      generarJWT(usuario).then((token) => {
        res.status(200).json({ token });
      });
    });

  router
    .route('/reset')
    .get(verificarPreReset, (req, res) => {
      if (req.usuario.email)
        res.status(200).render(path.join(__dirname, '../views/login/', 'reset.hbs'), { token: req.query.tokenparam, email: req.usuario.email, layout: '' });
      else
        res.status(200).render(path.join(__dirname, '../views/login/', 'error.hbs'), { layout: '' });
    })
    .post(verificarReset, async (req, res) => {
      const { email } = req.usuario;
      const { password, repetir_password } = req.body;
    
      db.Users.findOne({
        where: {
          email,
        },
        attributes: campos,
      }).then((registro) => {
        if (!registro) throw new Error('Registro no encontrado');
  
        if (password === repetir_password) {
          const valores = { encrypted_password: bcryptjs.hashSync(password, 10) };

          registro.update(valores).then((actualizado) => {
            
            db.Tokens.create({ revocado: req.query.tokenparam }).then(() => {
              globalThis.alertaGlobal = 'Contraseña actualizada correctamente';
              console.log(`Contraseña actualizada correctamente ${JSON.stringify(actualizado, null, 2)}` );
              res.redirect(`/login`);
              //globalThis.alertaGlobal = '';
            });
          });
        }
        else {
          globalThis.alertaGlobal = 'ERROR: la nueva contraseña y la repetición de la misma debe coincidir, vuelva a intentarlo';
          res.redirect(`/login/reset?tokenparam=${req.query.tokenparam}`);
          //globalThis.alertaGlobal = '';
        }
      }).catch((error) => {
        globalThis.alertaGlobal = 'ERROR: no fue posible modificar el usuario correctamente, vuelva a intentarlo';
        console.log(error);
        res.redirect(`/login?tokenparam=${req.query.tokenparam}`);
        //globalThis.alertaGlobal = '';
      });
    });

  router
    .route('/forgot')
    .get((req, res) => {
      res.status(200).render(path.join(__dirname, '../views/login/', 'olvido.hbs'), { layout: '' });
    }).post( (req, res) => {
      const usuario = {email: req.body.email, password: 'resetear' };

      generarJWT(usuario, '10m').then((token) => {
        const email = require('../helpers/email.js');
        email.enviarEmail(req.body.email,
          ` 
            Buenos días,
  
            para realizar el cambio de contraseña, debe usted hacer clic sobre el siguiente enlace. El enlace caduca en 10 minutos.
  
            http://192.168.81.129:8080/login/reset?tokenparam=${ token }
  
            Atentamente,
            El administrador del sistema.
          `
        );
      });
      
      res.status(200).json({ msg: 'Este mensaje no sirve para nada, solo devolvemos algo a la función fetch del navegador' });
    });

  router
    .route('/email')
    .get((req, res) => {
      globalThis.alertaGlobal = 'Se le ha enviado un email con instrucciones para la recuperación de la contraseña';
      res.redirect(`/login`);
      //globalThis.alertaGlobal = '';
    });

  return router;
};
