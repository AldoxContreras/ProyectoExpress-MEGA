const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var AutoIncrement = require('mongoose-sequence')(mongoose);

const ClienteSchema = new mongoose.Schema({
    id: { type: String },
    Nombre: { type: String, required: true },
    Apellido1: { type: String, require: true },
    Apellido2: { type: String },
    Direccion: { type: String },
    Telefono: { type: String },
    Estado: { type: String },
    Cita: [{
        id_cita: { type: Number, unique: false },
        Fecha_Hora: { type: Date },
        Motivo: { type: String },
        Estado: { type: String },
        id_Empleado: { type: String },
        Matricula_Vehiculo: { type: String }
    }, { sparse: true }],
    Vehiculo: [{
        Matricula: { type: String, unique: false },
        Marca: { type: String },
        Modelo: { type: String }
    }, { unique: false }]

});
ClienteSchema.plugin(AutoIncrement, { id_cita: 'order_seq', inc_field: 'order' });


mongoose.model('Cliente', ClienteSchema);
ClienteSchema.index({ id_cita: 1 }, { sparse: true });