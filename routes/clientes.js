var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
//const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Clientes = mongoose.model('Cliente'); //importar el schema del models

router.get('/', async(req, res, ) => { //llenar el objeto una sola vez
    await Clientes.find((err, cliente) => {
            if (err) { return res.send(err) }
            res.send(cliente)
        })
        //res.send('Estas en usuario');
});

//Buscar por un campo
router.post('/buscar', async(req, res, next) => {
    const clientes = await Clientes.find({ nombre: req.body.buscar })

    if (!clientes) {
        return res.status(400).send("Cliente no encontrado")
    } else {
        res.json(clientes)
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
    check('Cita').isArray(),
    check('Vehiculo').isArray(),

], async(req, res) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() }); //status 422 entidad no procesable
    } //
    cliente = new Clientes({
        _id: req.body._id,
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1, //ponemos variable  nombrecifrado para que mande cifrado
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado,
        Cita: req.body.Cita,
        Vehiculo: req.body.Vehiculo,
        //llamar los datos del formulario
    })
    await Clientes.save() //funcion  de guardado
    res.status(200).send(cliente) //funcion de repuesta 
});


//Modificar
router.put('/', async(req, res) => {
    const clientebusc = await Clientes.findOneAndUpdate({ _id: req.body._id }, {
        _id: req.body._id,
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1,
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado,
        Cita: req.body.Cita,
        Vehiculo: req.body.Vehiculo,
    }, {
        new: true
    })
    res.status(201).send(clientebusc)
})


//eliminar
router.post('/borrar', async(req, res) => {
    await Clientes.findOneAndDelete({ _id: req.body._id },
        function(err, clienteeliminado) {
            if (err) {
                res.send(err)
            }
            res.json({ Mensaje: 'Cliente eliminado' })
        })
})





module.exports = router;