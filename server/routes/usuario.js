const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const {
  verificaToken,
  verificaAdmin_Role,
} = require('../middleware/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  let find = { estado: true };

  // {google:true} - filtrar por campo
  Usuario.find(find, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      // {google:true} - filtrar por campo
      Usuario.count(find, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          conteo,
        });
      });
    });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    //res.json()
    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id;
  // underscore
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

app.delete('/usuario/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  //let body = _.pick(req.body, ['estado']);

  Usuario.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );

  // BORRADO FISICO DEL DATO
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err,
  //     });
  //   }

  //   //!usuarioBorrado
  //   if (usuarioBorrado === null) {
  //     return res.status(400).json({
  //       ok: false,
  //       error: {
  //         message: 'Usuario no encontrado',
  //       },
  //     });
  //   }

  //   res.json({
  //     ok: true,
  //     usuario: usuarioBorrado,
  //   });
  // });
});

module.exports = app;
