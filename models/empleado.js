const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
const EmpleadoSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    Nombre:{
        type: String,
        required: true
    },
    Apellido1:{
        type: String,
        required: true,
    },
    Apellido2:{
        type: String,
        //required: false,
    },
    Direccion:{
        type: String,
        required: true
    },
    Telefono:{
        type: String,
        required: true
    },
    Estado:{
        type: String,
        required: true
    }


})


mongoose.model('Empleado', EmpleadoSchema) //para poner nombre al schema