var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
//const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Empleados = mongoose.model('Empleado'); //importar el schema del models

router.get('/', async(req, res, ) => { //llenar el objeto una sola vez
    await Empleados.find((err, empleado) => {
            if (err) { return res.send(err) }
            res.send(empleado)
        })
        //res.send('Estas en usuario');
});

//Buscar por un campo
router.post('/buscar', async(req, res, next) => {
    const empleados = await Empleados.find({ nombre: req.body.buscar })

    if (!empleados) {
        return res.status(400).send("Empleado no encontrado")
    } else {
        res.json(empleados)
    }
})

router.post('/', [
    check('_id').isString({ min: 1 }),
    check('Nombre').isString({ min: 1 }),
    check('Apellido1').isString({ min: 8 }),
    check('Apellido2').isString(),
    check('Direccion').isString(),
    check('Telefono').isString(),
    check('Estado').isString(),
], async(req, res) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() }); //status 422 entidad no procesable
    } //
    empleado = new Empleados({
        _id: req.body._id,
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1, //ponemos variable  nombrecifrado para que mande cifrado
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado,
        //llamar los datos del formulario
    })
    await Empleados.save() //funcion  de guardado
    res.status(200).send(Empleados) //funcion de repuesta 
});


//Modificar
router.put('/', async(req, res) => {
    const empleadobusc = await Empleados.findOneAndUpdate({ _id: req.body._id }, {
        _id: req.body._id,
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1,
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado,
    }, {
        new: true
    })
    res.status(201).send(empleadobusc)
})


//eliminar
router.post('/borrar', async(req, res) => {
    await Empleados.findOneAndDelete({ _id: req.body._id },
        function(err, empleadoeliminado) {
            if (err) {
                res.send(err)
            }
            res.json({ Mensaje: 'Empleado eliminado' })
        })
})





module.exports = router;