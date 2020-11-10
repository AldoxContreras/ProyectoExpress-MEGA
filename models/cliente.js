const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const ClienteSchema = new mongoose.Schema({
    id: {type: String},
    Nombre: {type: String, required: true},
    Apellido1: {type: String, require: true},
    Apellido2: {type: String},
    Direccion: {type: String},
    Telefono: {type: String},
    Estado: {type: String},
    Cita: [{
        id_cita: {type: Number},
        Fecha_Hora: {type: Date},
        Motivo: {type: String},
        Estado: {type: String},
        id_Empleado: {type: String},
        Matricula_Vehiculo: {type: String}
    }],
    Vehiculo: [{
        Matricula: {type: String, unique: true},
        Marca: {type: String},
        Modelo: {type: String}
    }]

});
mongoose.model('Cliente', ClienteSchema);