const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { socketController } = require('./sockets.js');
const db = require('../db/connection.js');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.hbs = require('express-handlebars');

    this.dbConnection();
    this.middlewares();
    this.routes();
    this.sockets();
    this.listen();
  }

  async dbConnection() {
    try {
      await db.sequelize.authenticate();
      console.log('Database online');
    } catch (e) {
      throw new Error(e);
    }
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(fileUpload());
    // this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static('public'));
    this.app.engine(
      '.hbs',
      this.hbs({
        extname: '.hbs',
        defaultLayout: 'cabecera',
      })
    );
    this.app.set('view engine', '.hbs');
    this.app.set('views', path.join(__dirname, '../views'));
  }

  routes() {
    this.app.use('/login', require('../routes/login')());
    this.app.use('/home', require('../routes/home')());
    this.app.use('/users', require('../routes/users')());
    this.app.use('/principales', require('../routes/principales')());
    this.app.use('/buscar', require('../routes/buscar')());
    /*
    this.app.use('/', (req, res, next) => {
      console.log('======= REDIRECT =========');

      res.redirect('/principales');
    });
    */
  }

  sockets() {
    this.io.on('connection', (socket) => {
      socketController(socket);
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('Servidor web corriendo en el puerto', this.port);
    });
  }
}

module.exports = Server;
