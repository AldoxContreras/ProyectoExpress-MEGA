var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
//const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Citas = mongoose.model('Cita'); //importar el schema del models

//METODO CONSULTAR
router.get('/', async(req, res, next) => { //llenar el objeto una sola vez
    await Citas.find((err, cita) => {
            if (err) { return res.send(err) }
            res.send('Estas en cita');
        })
        //res.send('Estas en usuario');
});

//Buscar por un campo
router.post('/buscar', async(req, res, next) => {
    const cita = await Citas.find({ id: req.body.buscar })

    if (!cita) {
        return res.status(400).send("Cita no encontrado")
    } else {
        res.json(cita)
    }
})

//METODO DE INSERCION
router.post('/', [
    check('_id').isLength(),
    check('Fecha').isLength({ min: 10 }),
    check('Hora').isLength({ min: 5 }),
    check('Estado').isLength({ min: 9 }),
    check('Id_Empleado').isLength(),
    check('Telefono').isLength({ min: 10 }),
    check('Matricula_Vehiculo').isLength(),
], async(req, res) => {
    const errors = validationResult(req); //
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() }); //status 422 entidad no procesable
    } //
    cita = new Citas({
        id: req.body.id,
        Fecha: req.body.Fecha,
        Hora: req.body.Hora, //ponemos variable  nombrecifrado para que mande cifrado
        Estado: req.body.Estado,
        Id_Empleado: req.body.Id_Empleado,
        Telefono: req.body.Telefono,
        Matricula_Vehiculo: req.body.Matricula_Vehiculo,
        //llamar los datos del formulario
    })
    await cita.save() //funcion  de guardado
    res.status(200).send(cita) //funcion de repuesta 
});

//METODO MODIFICAR
router.put('/', async(req, res) => {
    const cita = await Citas.findOne({ id: req.body.id })

    if (!cita) {
        return res.status(400).send("Cita no encontrado")
    }

    cita_mod = await Citas.findOneAndUpdate({ id: req.body.id }, {
        id: req.body.id,
        Fecha: req.body.Fecha,
        Hora: req.body.Hora, //ponemos variable  nombrecifrado para que mande cifrado
        Estado: req.body.Estado,
        Id_Empleado: req.body.Id_Empleado,
        Telefono: req.body.Telefono,
        Matricula_Vehiculo: req.body.Matricula_Vehiculo,
    }, {
        new: true
    })
    res.send(cita_mod)
});


//METODO ELIMINAR
router.post('/borrar', async(req, res) => {
    const cita = await Citas.findOne({ id: req.body.id })
    if (!cita) {
        return res.status(400).send("Cita no encontrado")
    }

    cita_eliminado = await Citas.findOneAndDelete({ id: req.body.id })

    res.send(cita)
});

router.get('/:codigo', async(req, res) => {
    cita = await Citas.findOne({ id: req.params.id })
    if (!cita) {
        return res.status(404).send("Cita no encontrado")
    }
    res.status(200).send(cita)
});




module.exports = router;