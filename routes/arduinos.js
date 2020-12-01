var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var SerialPort = require("serialport");


//const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Arduinos = mongoose.model('Arduino'); //importar el schema del models

var arduinoCOMPort = "COM3";
const ReadLine =SerialPort.parsers.Readline


var arduinoSerialPort = new SerialPort(arduinoCOMPort, {  
    baudRate: 9600
   },true);

//Esto es un salto de linea
const parser= arduinoSerialPort.pipe(new ReadLine({delimiter: '\r\n'}))
//Encargada de sobreescribirse con la info del sensor
let valor=""

//Mostrar la informacion del valor
router.get('/verdistancia', async (req,res)=>{
    res.send({valor})
})

//consultar Todo
router.get('/', async (req,res)=>{
  
  let distancias = await Arduinos.find()

  if(!distancias){
      return res.status(450).send("No hay distancias")
  }

  res.send(distancias)
  
});

//
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
     
      //console.log(data);
      valor = data.toString('utf8'); 
    });


module.exports = router;