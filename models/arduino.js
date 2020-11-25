const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
const ArduinoSchema = new mongoose.Schema({
    Codigo:{
        type:Number,
        unique:true,
        required:true
    },
    Accion:{
        type:String,
        required:true
    },
    Fecha_reg:{
        type:Date,
        default: Date.now
    }
})

mongoose.model('Arduino', ArduinoSchema) //para poner nombre al schema