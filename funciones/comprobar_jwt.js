const jwt = require('jsonwebtoken');
const db = require('../db/connection.js');

const comprobarJWT = async (token) => {

  if (!token) {
    globalThis.alertaGlobal = 'ERROR: No hay token en la petición';
    console.log(globalThis.alertaGlobal);
    return false;
  }

  try {
    const revocado = await db.Tokens.findOne({
      where: {
        revocado: token,
      },
    });

    if (revocado) {
      return false;
    }

    const { email } = jwt.verify(token, process.env.PRIVATEKEY);
    const usuario = await db.Users.findOne({
      where: {
        email,
      },
    });

    if (!usuario) {
      return false;
    }
    return usuario.dataValues;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  comprobarJWT,
};

