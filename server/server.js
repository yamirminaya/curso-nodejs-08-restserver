require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
  res.json('GET USUARIO');
});

app.post('/usuario', (req, res) => {
  let body = req.body;
  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: 'Nombre necesario',
    });
  } else {
    res.json({ persona: body });
  }
});

app.put('/usuario/:id', (req, res) => {
  let id = req.params.id;
  res.json({ id });
});

app.listen(process.env.PORT, () => {
  console.log(`Corriendo en el puerto ${process.env.PORT}`);
});
