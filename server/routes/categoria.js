const express = require('express')
const _ = require('underscore')

let {
  verificaToken,
  verificaAdmin_Role,
} = require('../middleware/autenticacion')

let app = express()
let Categoria = require('../models/categoria')

// ===========================
// Mostrar todas las categorias
// ===========================
app.get('/categoria', verificaToken, (req, res) => {
  let desde = req.query.desde || 0
  desde = Number(desde)

  let limite = req.query.limite || 5
  limite = Number(limite)

  Categoria.find({}, 'descripcion usuario')
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(limite)
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        })
      }

      Categoria.count((err, conteo) => {
        res.json({
          ok: true,
          categorias,
          conteo,
        })
      })
    })
})

// ===========================
// Mostrar una categoría por ID
// ===========================
app.get('/categoria/:id', async (req, res) => {
  try {
    let id = req.params.id
    let categoria = await Categoria.findById(id).exec()
    res.json({ ok: true, categoria })
  } catch (err) {
    res.status(400).json({
      ok: false,
      err: {
        message: 'No existe categoría',
      },
    })
  }
})

// ===========================
// Crear nueva categoría
// ===========================
app.post('/categoria', verificaToken, (req, res) => {
  let body = req.body
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  })
  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      })
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    })
  })
})

// ===========================
// Actualizar la categoria (descripción)
// ===========================
app.put('/categoria/:id', verificaToken, (req, res) => {
  let _id = req.params.id

  let body = _.pick(req.body, ['descripcion'])
  //{$set:{descripcion:body.descripcion}}

  Categoria.findByIdAndUpdate(
    _id,
    { $set: body },
    { new: true, runValidators: true, context: 'query' },
    (err, categoriaDB) => {
      console.log(err)
      console.log(categoriaDB)

      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        })
      }
      res.json({ ok: true, categoria: categoriaDB })
    }
  )
})

// ===========================
// Actualizar la categoria (descripción)
// ===========================
app.delete(
  '/categoria/:id',
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    let _id = req.params.id
    console.log(_id)
    // solo un administrador puede borrar categorías
    // eliminar físicamente
    Categoria.findOneAndRemove(_id, (err, categoriaDB) => {
      console.log(err)
      console.log(categoriaDB)
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El id no existe',
          },
        })
      }

      res.json({ ok: true, err: { message: 'Categoría borrada' } })
    })
  }
)

module.exports = app
