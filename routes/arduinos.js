var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var SerialPort = require("serialport");


//const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Arduinos = mongoose.model('Arduino'); //importar el schema del models

var arduinoCOMPort = "COM4";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {  
 baudRate: 9600
});

arduinoSerialPort.on('open',function() {
  console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

router.get('/', function(req, res){
    return res.send('Trabajando');
})

router.get('/:action', function (req, res){
    var action = req.params.action || req.param('action');

    if(action == 'dis'){
        arduinoSerialPort.write("");
    }
})
module.exports = router;