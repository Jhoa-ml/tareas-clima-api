require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Ruta de prueba
app.post(
  '/api/echo',
  body('mensaje')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),
  (req, res) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array()
      });
    }

    res.json({
      recibido: req.body.mensaje
    });
  }
);

// Ruta salud
app.get('/api/salud', (req, res) => {
  res.json({
    status: "ok"
  });
});


// Endpoint solicitado en el reto
app.post(
  '/api/registro',

  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .escape(),

  body('correo')
    .isEmail()
    .withMessage('Correo electrónico inválido')
    .normalizeEmail(),

  (req, res) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array()
      });
    }

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      datos: req.body
    });

  }
);
const tareasRouter = require('./routes/tareas');
app.use('/api/tareas', tareasRouter);

module.exports = app;