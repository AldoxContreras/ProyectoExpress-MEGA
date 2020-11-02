var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuario');


router.get('/', async(req, res, ) => { //llenar el objeto una sola vez
    await Usuarios.find((err, usuario) => {
            if (err) { return res.send(err) }
            res.send(usuario)
        })
        //res.send('Estas en usuario');
});

router.post('/', [
    check('_id').isString({ min: 1 }),
    check('Usuario').isString({ min: 1 }),
    check('Contrasena').isString({ min: 8 }),
    check('Tipo').isString(),
], async(req, res) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() }); //status 422 entidad no procesable
    } //
    const salt = await bcrypt.genSalt(10)
    const contracifrado = await bcrypt.hash(req.body.contrasena, salt)
        // const  nombrecifrado=await bcrypt.hash(req.body.nombre,salt)//para que el nombre sea cifrado
        //usuario = new Usuarios(req.body)
        //llenar objetos en partes
    usuario = new Usuarios({
        _id: req.body._id,
        Usuario: req.body.Usuario,
        Contrasena: req.body.Contrasena, //ponemos variable  nombrecifrado para que mande cifrado
        Tipo: req.body.tipo,
        Contrasena: contracifrado
    })
    await usuario.save() //funcion  de guardado
    res.status(200).send(usuario) //funcion de repuesta 
});

router.post('/iniciosesion', [ //para iniciar sesion/ inicia post
    check('Usuario').isString(), //validacion 
    check('Contrasena').isString({ min: 5 }) //validacion 
], async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty) { //inicia if
        return res.status(422).json({ errors: errors.array() })
    } //termina if
    let usuario = await Usuarios.findOne({ Usuario: req.body.Usuario })
    if (!usuario) {
        return res.status(400).send('Usuario o contraseña invalido')
    }
    const validacontrasenia = await bcrypt.compare(req.body.contrasena, usuario.contrasena)
    if (!validacontrasenia) {
        return res.status(400).send('Usuario o contraseña invalido')
    }
    const jwtoken = usuario.generadorJWT();
    const envio = jwtoken + "," + usuario.Usuario + "," + usuario.Tipo
    res.status(201).send({ jwtoken })
}); //termina post

router.put('/', async(req, res) => {
    const usuario = await Usuarios.findOne({ _id: req.body._id })
    if (!usuario) {
        return res.status(400).send("Usuario no encontrado")

    }
    const salt = await bcrypt.genSalt(10)
    const contracifrado = await bcrypt.hash(req.body.contrasena, salt)
    usuario_mod = await Usuarios.findOneAndUpdate({ _id: req.body._id }, { //actualizar los datos 
        Usuario: req.body.Usuario,
        Tipo: req.body.Tipo,
        Contrasena: contracifrado
    }, {
        new: true
    })
    res.send(usuario_mod)
})
router.delete('/', async(req, res) => {
    const usuario = await Usuarios.findOne({ _id: req.body._id })
    if (!usuario) {
        return res.status(400).send("usuario no encontrado")
    }
    usuario_eliminado = await Usuarios.findOneAndDelete({ _id: req.body._id })
    res.send("usuario eliminado")
})

module.exports = router;