require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const authRouter = require('./routes/auth');
const climaRouter = require('./routes/clima');
const tareasRouter = require('./routes/tareas');

const verificarToken = require('./middleware/auth');


const app = express();


// Middleware de seguridad
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));



// =========================
// Ruta de prueba
// =========================

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



// =========================
// Salud del servidor
// =========================

app.get('/api/salud', (req, res) => {

  res.json({

    status: "ok"

  });

});



// =========================
// AUTENTICACIÓN
// Rutas públicas
// =========================

app.use(
  '/api/auth',
  authRouter
);



// =========================
// RUTAS PROTEGIDAS JWT
// =========================


app.use(
  '/api/tareas',
  verificarToken,
  tareasRouter
);


app.use(
  '/api/clima',
  verificarToken,
  climaRouter
);



module.exports = app;