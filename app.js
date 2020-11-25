var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
//Libreria Serialport para el arduino
var SerialPort = require("serialport");

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://NormaG:Perrafina1_@cluster0.7swjn.mongodb.net/MEGA', {useNewUrlParser: true, useUnifiedTopology: true });

require('./models/empleado') //Schema a utilizar en el proyecto
require('./models/cliente')
require('./models/usuario')
require('./models/arduino')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios');
var empleadoRouter = require('./routes/empleados');
var clienteRouter = require('./routes/clientes');
var arduinoRouter = require('./routes/arduinos');


var app = express();

app.use(cors({
    "origin": "http://localhost:4200",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usuario', usersRouter);
app.use('/empleado', empleadoRouter);
app.use('/cliente', clienteRouter);
app.use('/arduino', arduinoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;