//require('./config/config');
// process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// if (process.env.NODE_ENV === 'dev') {
//   require('dotenv').config({
//     path: `${__dirname}/.env.${process.env.NODE_ENV}`,
//   });
// } else {
//   require('dotenv').config();
// }
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// const cors = require('cors');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración global de rutas
app.use(require('./routes/index'));

/************************************/
// app.use((req, res, next) => {
//   // Dominio que tengan acceso (ej. 'http://example.com')
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   // Metodos de solicitud que deseas permitir
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

//   // Encabecedados que permites (ej. 'X-Requested-With,content-type')
//   res.setHeader('Access-Control-Allow-Headers', '*');

//   next();
// });

// app.use(cors());
/************************************/

// MONGO DB
// let uri = ``;
//console.log(process.env.NODE_ENV);
// if (process.env.NODE_ENV == 'dev') {
//   const uri = `mongodb://localhost:27017/cafe`;
// } else {
//   let uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.la8ac.mongodb.net/${process.env.DBNAME}`;
// }
// console.log(uri);
const uri =
  process.env.NODE_ENV == 'dev'
    ? `mongodb://localhost:27017/cafe`
    : `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.la8ac.mongodb.net/${process.env.DBNAME}`;

// let uri = `mongodb://localhost:27017/cafe`;

const db = mongoose.connection;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((err) => console.log(err));

// Eventos
db.on('open', (_) => {
  console.log('Database is connected to', uri);
});

db.on('error', (err) => {
  console.log(err);
});

app.listen(process.env.PORT, () => {
  console.log(`Corriendo en el puerto ${process.env.PORT}`);
});
