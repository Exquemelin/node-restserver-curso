// Importación de los paquetes
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};


// Declaramos un nuevo Schema (la norma marca la primera mayúscula, no es necesario) basado en mongoose
let Schema = mongoose.Schema;


// Establecemos un Schema de usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'], // Mensaje si no se introduce el nombre
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
        required: false,
    }, // no es obligatoria
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
    }, // default: 'USER_ROLE'
    estado: {
        type: Boolean,
        default: true,
    }, // boolean
    google: {
        type: Boolean,
        default: false,
    }, // boolean
});


// En este método, cuando se haga la impresión le quitamos el password para que no salga ni la palabra
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

};


usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});


// Hacemos la exportación
module.exports = mongoose.model('Usuario', usuarioSchema)