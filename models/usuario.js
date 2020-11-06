const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

mongoose.set('useCreateIndex', true)

const UsuarioSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    Usuario:{
        type: String,
        required: true
    },
    Contrasena:{
        type: String,
        required: true
    },
    Tipo:{
        type: String,
        required: true
    }
})

UsuarioSchema.methods.generadorJWT = function(){
    return jwt.sign({
        Usuario: this.Usuario,
        Tipo: this.Tipo
    },"c0ntr4sen1a")
}

mongoose.model('Usuario', UsuarioSchema)

