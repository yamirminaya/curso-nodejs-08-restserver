const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

//* Verificar TOKEN
let verificaToken = (req, res, next) => {
  let token = req.get('token')
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      //401 - no autorizado
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no válido',
        },
      })
    }
    req.usuario = decoded.usuario
    next()
  })
}

//* Verificar TOKEN ADMINISTRADOR
let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario

  Usuario.findOne({ email: usuario.email }, (err, usuarioDB) => {
    if (usuarioDB.role === 'ADMIN_ROLE') {
      next()
    } else {
      return res.json({
        ok: false,
        err: {
          message: 'El usuario no es administrador',
        },
      })
    }
  })
}

//* Verificar TOKEN IMAGEN
let verificaTokenImg = (req, res, next) => {
  let token = req.query.token
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      //401 - no autorizado
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no válido',
        },
      })
    }
    req.usuario = decoded.usuario
    next()
  })
}

module.exports = {
  verificaToken,
  verificaAdmin_Role,
  verificaTokenImg,
}
