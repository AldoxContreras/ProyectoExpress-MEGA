var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
//const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Clientes = mongoose.model('Cliente'); //importar el schema del models

//METODO CONSULTAR
router.get('/', async(req, res, next) => { //llenar el objeto una sola vez
    await Clientes.find((err,cliente) => {
        if(err){return res.send(err)}
            res.send(cliente);
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

//METODO DE INSERCION
router.post('/', [
    check('id').isLength({min:1}),
    check('Nombre').isLength({min:1}),
    check('Apellido1').isString({min:1}),
    check('Apellido2').isLength({min:1}),
    check('Direccion').isLength({min:1}),
    check('Telefono').isLength({min:1}),
    check('Estado').isLength({min:1}),
    check('Cita').isArray(),
    check('Vehiculo').isArray(),
], async(req,res) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()}); //status 422 entidad no procesable
    } //

    cliente = new Clientes({
        id:req.body.id,
        Nombre:req.body.Nombre,
        Apellido1:req.body.Apellido1, //ponemos variable  nombrecifrado para que mande cifrado
        Apellido2:req.body.Apellido2,
        Direccion:req.body.Direccion,
        Telefono:req.body.Telefono,
        Estado:req.body.Estado,
        Cita:req.body.Cita,
        Vehiculo:req.body.Vehiculo,
        //llamar los datos del formulario
    })
    await cliente.save() //funcion  de guardado
    res.status(200).send(cliente) //funcion de repuesta 
});


//Modificar
router.put('/', async(req, res) => {
    const clientebusc = await Clientes.findOne({id:req.body.id}) 
    
    if(!cliente){
        return res.status(400).send("Cliente no encontrado")
    }

    cliente_mod = await Clientes.findOneAndUpdate({id:req.body.id},
    {
        id: req.body.id,
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1,
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado,
        Cita: req.body.Cita,
        Vehiculo: req.body.Vehiculo,
    }, 
    {
        new: true
    })
    res.status(201).send(cliente_mod)
});


//eliminar
router.post('/borrar', async(req, res) => {
    const cliente = await Clientes.findOne({id:req.body.id})
    if(!cliente){
        return res.status(400).send("Cliente no encontrado")
    }

    cliente_eliminado= await Clientes.findOneAndDelete({id:req.body.id})

  res.send(cliente)
});


router.get('/:id', async(req,res)=>{
    cliente= await Clientes.findOne({id:req.params.id})
    if(!cliente){
      return res.status(404).send("Cliente no encontrado")
    }
    res.status(200).send(cliente)
  });


module.exports = router;