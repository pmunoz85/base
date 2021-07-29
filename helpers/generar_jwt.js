const jwt = require('jsonwebtoken');

const generarJWT = (usuario, expira = '4h') => {
  const email = usuario.email;

  return new Promise((resolve, reject) => {
    const payload = { email };

    jwt.sign(
      payload,
      process.env.PRIVATEKEY,
      {
        expiresIn: expira,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};
