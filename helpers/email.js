
const enviarEmail = async (email_to, cuerpo) => {
  const nodemailer = require('nodemailer');

  const configuracion = {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  const mensaje = {
    from: process.env.EMAIL_USER,
    to: email_to,
    subject: 'Recuperación de contraseña',
    text: cuerpo
  };

  const transporter = nodemailer.createTransport(configuracion);

  await transporter.sendMail(mensaje, (e, info) => {
    if (e) 
      console.log(e);
    else 
      console.log(info);
  });
}

exports.enviarEmail = enviarEmail;
