const lblOnline = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');
const btnEnviar = document.querySelector('#btnEnviar');
const txtMensaje = document.querySelector('#txtMensaje');
const btnLogin = document.querySelector('#btnLogin');

const socket = io();

socket.on('connect', () => {
  lblOffline.style.display = 'none';
  lblOnline.style.display = '';
});

socket.on('disconnect', () => {
  lblOffline.style.display = '';
  lblOnline.style.display = 'none';
});

socket.on('mensaje', (payload) => {
  console.log(payload);
});

btnLogin.addEventListener('click', () => {
  window.location.href = '/login';
});

btnEnviar.addEventListener('click', () => {
  const mensaje = txtMensaje.value;
  console.log(mensaje);
  const payload = {
    mensaje,
    id: '123456',
    fecha: new Date().getTime(),
  };

  socket.emit('mensaje', payload, (id) => {
    console.log('Mensaje envaido desde el servidor', payload, id);
  });
});
