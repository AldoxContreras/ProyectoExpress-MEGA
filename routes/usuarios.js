var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuario');

//METODO CONSULTAR TODO
router.get('/', async(req, res, next) => { //llenar el objeto una sola vez
    await Usuarios.find((err, usuario) => {
            if(err){return res.send(err)}
            res.send(usuario);
        })
        //res.send('Estas en usuario');
});
//METODO INSERCION DE DATOS
router.post('/',[
    check('id').isLength({min:1}),
    check('Usuario').isLength({min:1}),
    check('Contrasena').isLength({min:1}),
    check('Tipo').isLength({min:1}),
], async(req, res) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()}); //status 422 entidad no procesable
    } //
    const salt = await bcrypt.genSalt(10)
    const contracifrado = await bcrypt.hash(req.body.Contrasena,salt)
        // const  nombrecifrado=await bcrypt.hash(req.body.nombre,salt)//para que el nombre sea cifrado
        //usuario = new Usuarios(req.body)
        //llenar objetos en partes
    usuario = new Usuarios({
        id: req.body.id,
        Usuario: req.body.Usuario,
        Contrasena: contracifrado, //ponemos variable  nombrecifrado para que mande cifrado
        Tipo: req.body.Tipo,
    })
    await usuario.save() //funcion  de guardado
    res.status(200).send(usuario) //funcion de repuesta 
});

//METODO POST LOGIN
router.post('/iniciosesion',[ //para iniciar sesion/ inicia post
    check('Usuario').isLength(), //validacion 
    check('Contrasena').isLength({min:5}) //validacion 
], async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty) { //inicia if
        return res.status(422).json({errors: errors.array()})
    } //termina if

    let usuario = await Usuarios.findOne({Usuario: req.body.Usuario})
    if(!usuario) {
        return res.status(400).send('Usuario o contraseña invalido')
    }
    const validacontrasena = await bcrypt.compare(req.body.Contrasena,usuario.Contrasena)
    if(!validacontrasena) {
        return res.status(400).send('Usuario o contraseña invalido')
    }
    const jwtoken = usuario.generadorJWT();
    const envio = jwtoken + "," + usuario.Usuario + "," + usuario.Tipo
    res.status(201).send({envio})
}); //termina post

//METODO MODIFICAR
router.put('/', async(req,res) => {
    const usuario = await Usuarios.findOne({id:req.body.id})
    if (!usuario) {
        return res.status(400).send("Usuario no encontrado")
    }
    const salt = await bcrypt.genSalt(10)
    const contracifrado = await bcrypt.hash(req.body.Contrasena,salt)

    usuario_mod = await Usuarios.findByIdAndUpdate({id:req.body.id}, 
    { //actualizar los datos 
        Usuario:req.body.Usuario,
        Contrasena: contracifrado 
    }, 
    {
        new: true
    })
    res.send(usuario_mod)
})
//METODO ELIMINAR
router.post('/borrar', async(req, res) => {
    const usuario = await Usuarios.findOne({id:req.body.id})
    if (!usuario) {
        return res.status(400).send("usuario no encontrado")
    }
    usuario_eliminado = await Usuarios.findOneAndDelete({id:req.body.id})
    res.send(usuario)
});

router.get('/:codigo', async(req,res)=>{
    usuario= await Usuarios.findOne({id:req.params.id})
    if(!usuario){
      return res.status(404).send("Usuario no encontrado")
    }
    res.status(200).send(usuario)
  });


//-------------------------- Sección móvil -----------------------------------

//Inicio de sesión para móvil
router.post('/iniciocliente', [
    check('Usuario').isLength({min: 1}),
    check('Contrasena').isLength({min: 5})
], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty){//Valida que no existan errores
        return res.status(422).json({errors: errors.array()});
    }
    //Sección de buscar al usuario y validar que exista
    let usuario = await Usuarios.findOne({Usuario: req.body.Usuario});
    if(!usuario){
        return res.status(400).send('Usuario o contraseña incorrecto')
    }
    //Seccion donde compara la contraseña del formulario con la de la BDD
    const comparapass = await bcrypt.compare(req.body.Contrasena, usuario.Contrasena);
    if(!comparapass){
        return res.status(400).sent('Usuario o contraseña incorrecto');
    }
    //Valida que el usuario sea del tipo cliente
    if(usuario.Tipo == "C"){
        const jwtoken = usuario.generadorJWT();
        const envio = jwtoken+","+usuario.Usuario+","+usuario.Tipo;
        res.status(201).send({envio});
    }else{
        return res.status(400).send('Usuario o contraseña incorrecto');
    }

});//Fin inicio sesión para móvil



module.exports = router;