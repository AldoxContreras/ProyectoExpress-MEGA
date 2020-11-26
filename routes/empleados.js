var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
//const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Empleados = mongoose.model('Empleado'); //importar el schema del models

//METODO CONSULTAR empleados
router.get('/', async(req, res, next) => { //llenar el objeto una sola vez
    await Empleados.find((err, empleado) => {
            if (err) { return res.send(err) }
            res.send(empleado);
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

//METODO DE INSERCION
router.post('/', [
    check('id').isLength({ min: 1 }),
    check('Nombre').isLength({ min: 1 }),
    check('Apellido1').isLength({ min: 1 }),
    check('Apellido2').isLength({ min: 1 }),
    check('Direccion').isLength({ min: 1 }),
    check('Telefono').isLength({ min: 1 }),
    check('Estado').isLength({ min: 1 }),
], async(req, res) => {
    const errors = validationResult(req); //
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() }); //status 422 entidad no procesable
    } //

    empleado = new Empleados({
        id: req.body.id,
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1, //ponemos variable  nombrecifrado para que mande cifrado
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado,
        //llamar los datos del formulario
    })
    await empleado.save() //funcion  de guardado
    res.status(200).send(empleado) //funcion de repuesta 
});

//METODO MODIFICAR
router.put('/', async(req, res) => {
    const empleado = await Empleados.findOne({ id: req.body.id })

    if (!empleado) {
        return res.status(400).send("Empleado no encontrado")
    }

    empleado_mod = await Empleados.findOneAndUpdate({ id: req.body.id }, {
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1,
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado,
    }, {
        new: true
    })
    res.send(empleado_mod)
});


//METODO ELIMINAR
router.post('/borrar', async(req, res) => {
    const empleado = await Empleados.findOne({ id: req.body.id })
    if (!empleado) {
        return res.status(400).send("Empleado no encontrado")
    }

    empleado_eliminado = await Empleados.findOneAndDelete({ id: req.body.id })

    res.send(empleado)
});

router.get('/:id', async(req, res) => {
    empleado = await Empleados.findOne({ id: req.params.id })
    if (!empleado) {
        return res.status(404).send("Empleado no encontrado")
    }
    res.status(200).send(empleado)
});




module.exports = router;