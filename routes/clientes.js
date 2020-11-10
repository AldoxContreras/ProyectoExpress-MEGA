var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//Objeto llamado Clientes
const Clientes = mongoose.model('Cliente');
const { check, validationResult } = require('express-validator');


//Consulta de clientes
router.get('/', async(req,res)=>{
    await Clientes.find((err,cliente)=>{
        if(err){
            return res.send(err);
        }
        res.send(cliente);
    });
});//Fin de consulta de clientes


//Registro de cliente
router.post('/', [
    check('id').isLength({min: 1}),
    check('Nombre').isLength({min: 1, max: 100}),
    check('Apellido1').isLength({min: 1, max: 100}),
    check('Apellido2').isLength({max: 100}),
    check('Direccion').isLength({max: 255}),
    check('Telefono').isLength({max: 25})
], async(req,res)=>{
    cliente = new Clientes({
        id: req.body.id,
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1,
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado
    });
    await cliente.save();
    res.status(200).send(cliente);
});//Fin de registro de cliente


//Modificacion de cliente
router.put('/', async(req,res)=>{
    //Formato de buscar por id: atributo bd : req . body . nombre etiqueta html
    const cliente = await Clientes.findOne({id: req.body.id});
    if(!cliente){
        return res.status(400).send("Cliente no encontrado");
    }
    clienteModificado = await Clientes.findOneAndUpdate({id: req.body.id}, {
        Nombre: req.body.Nombre,
        Apellido1: req.body.Apellido1,
        Apellido2: req.body.Apellido2,
        Direccion: req.body.Direccion,
        Telefono: req.body.Telefono,
        Estado: req.body.Estado},
        {new:true});
        res.send(clienteModificado);
});//Fin de modificacion de cliente



//Eliminacion de cliente
router.post('/Eliminar', async(req,res)=>{
    const cliente = await Clientes.findOne({id: req.body.id});
    if(!cliente){
        return res.status(400).send("Cliente no encontrado");
    }
    cliente_eliminado = await Clientes.findOneAndDelete({id: req.body.id});
    res.send(cliente);
});//Fin de eliminacion de cliente


//Buscar cliente individual
router.get('/:id', async(req,res)=>{
    cliente = await Clientes.findOne({id: req.params.id});
    if(!cliente){
        return res.status(400).send("Cliente no encontrado");
    }
    res.status(200).send(cliente);
});//Fin buscar cliente individual
module.exports = router;