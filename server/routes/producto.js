const express = require('express')
const _ = require('underscore')

const { verificaToken } = require('../middleware/autenticacion')

let app = express()
let Producto = require('../models/producto')

// ===========================
// Obtener productos
// ===========================
app.get('/productos', verificaToken, (req, res) => {
  // trae todos los productos
  // populate: usuario categoria
  // paginado
  let desde = Number(req.query.desde || 0)
  let limite = Number(req.query.limite || 5)
  let filter = { disponible: true }
  Producto.find(filter)
    .sort('nombre')
    .populate('usuario', 'nombre email ')
    .populate('categoria', 'descripcion')
    .skip(desde)
    .limit(limite)
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        })
      }

      Producto.count(filter, (err, conteo) => {
        res.json({ ok: true, productos, conteo })
      })
    })
})

// ===========================
// Obtener producto por ID
// ===========================
app.get('/productos/:id', async (req, res) => {
  // populate: usuario categoria
  // paginado
  try {
    let id = req.params.id
    let producto = await Producto.findById(id).exec()
    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: { message: 'No existe producto' },
      })
    }
    res.json({ ok: true, producto })
  } catch (err) {
    console.log(producto)
    res.status(500).json({
      ok: true,
      err,
    })
  }
})

// ===========================
// Buscar productos
// ===========================
/**
 * * skskskk
 * ! sdkdkdk
 * ? dkdkdk
 * TODO: Refaccionar
 * @param :termino
 */
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
  let termino = req.params.termino

  // Expresión regular
  let regex = new RegExp(termino, 'i')

  Producto.find({ nombre: regex })
    .populate('categoria', 'nombre')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }
      res.json({
        ok: true,
        productos,
      })
    })
})

// ===========================
// Crear un nuevo producto
// ===========================
app.post('/productos', verificaToken, (req, res) => {
  // grabar el usuario
  // grabar una categoría del listado
  let body = req.body
  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  })
  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      })
    }

    res.json({
      ok: true,
      producto: productoDB,
    })
  })
})

// ===========================
// Actualizar un producto
// ===========================
app.put('/productos/:id', verificaToken, (req, res) => {
  // grabar el usuario
  // grabar una categoría del listado
  let _id = req.params.id
  let body = _.pick(req.body, [
    'nombre',
    'precioUni',
    'descripcion',
    'disponible',
    'categoria',
  ])
  Producto.findByIdAndUpdate(
    _id,
    { $set: body },
    { new: true, runValidators: true, context: 'query' },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err,
        })
      }
      res.json({ ok: true, producto: productoDB })
    }
  )
})

// ===========================
// Borrar un producto
// ===========================
app.delete('/productos/:id', verificaToken, (req, res) => {
  // grabar el usuario
  // cambiar a DISPONIBLE = FALSE
  //try {
  let _id = req.params.id
  Producto.findByIdAndUpdate(
    _id,
    {
      disponible: false,
    },
    { new: true },
    (err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }

      if (!productoBorrado) {
        return res.status(400).json({
          ok: false,
          err: { message: 'Producto no existe' },
        })
      }

      res.json({
        ok: true,
        producto: productoBorrado,
      })
    }
  )
})

module.exports = app
