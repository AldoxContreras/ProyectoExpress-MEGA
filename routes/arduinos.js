var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
//Libreria para conectar el arduino
var SerialPort = require("serialport");



const mongoose = require('mongoose');
//Se importa el Schema de Arduino
const Arduinos = mongoose.model('Arduino');
//Se indica el puerto de conexion con el arduino
var arduinoCOMPort = "COM3";
const ReadLine =SerialPort.parsers.Readline

//Se inicializa la conexion con el arduino
var arduinoSerialPort = new SerialPort(arduinoCOMPort, {  
    baudRate: 9600
   },true);

//Agrega un salto de linea
const parser= arduinoSerialPort.pipe(new ReadLine({delimiter: '\r\n'}))
//Encargada de sobreescribirse con la info del sensor
let valor=""

//Mostrar la informacion del valor
router.get('/verdistancia', async (req,res)=>{
    res.send({valor})
})

//consultar todos los datos de la bd
router.get('/', async (req,res)=>{
  
  let distancias = await Arduinos.find()

  if(!distancias){
      return res.status(450).send("No hay distancias")
  }

  res.send(distancias)
  
});

//Almacena los datos del sensor en la base de datos
router.post('/', async (req,res)=>{
    let numero = await Arduinos.find().count() + 1
      var arduinodistancia = new Arduinos({    
      Codigo : numero,
      Distancia : req.body.valor,
      Fecha_reg: req.body.fecha
    });
      await arduinodistancia.save();
      res.status(201).send(arduinodistancia)
    
  })
  
  //comunicacion con el hardware y express
  parser.on('open',function() {
    console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
  });

  //Lee la info del sensor y la sobreescribe
  parser.on('data',function(data) {
      valor = data.toString('utf8'); 
    });


module.exports = router;