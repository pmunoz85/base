require('dotenv').config();

globalThis.alertaGlobal = '';
globalThis.arrayAlertaGlobal = [];

const Server = require('./server/server');

const s = new Server();
