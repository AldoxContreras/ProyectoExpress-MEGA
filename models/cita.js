const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
const CitaSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    Fecha: {
        type: Date,
        required: true
    },
    Hora: {
        type: Date,
        required: true,
    },
    Motivo: {
        type: String,
        //required: false,
    },
    Estado: {
        type: String,
        required: true,

    },
    Id_Empleado: {
        type: String,
        required: true,
    },
    Matricula_Vehiculo: {
        type: String,
        required: true,
    }


})
mongoose.model('Cita', CitaSchema) //para poner nombre al schema