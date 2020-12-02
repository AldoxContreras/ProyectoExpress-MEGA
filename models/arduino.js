const mongoose = require('mongoose')
//Este schema es el que llevar en la base de datos
mongoose.set('useCreateIndex', true)
const ArduinoSchema = new mongoose.Schema({
    Codigo:{
        type:Number,
        unique:true,
        required:true
    },
    Distancia:{
        type:String,
        required:true
    },
    Fecha_reg:{
        type:String 
    }
})

mongoose.model('Arduino', ArduinoSchema) //para poner nombre al schema