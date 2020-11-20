// Importación de los paquetes
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Declaramos un nuevo Schema (la norma marca la primera mayúscula, no es necesario) basado en mongoose
let Schema = mongoose.Schema;

// Establecemos un Schema de categoría
let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario'], // Mensaje si no se introduce el nombre
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria'],
    },
    img: {
        type: String,
        required: false,
    }, // no es obligatoria
    estado: {
        type: Boolean,
        default: true,
    }, // boolean
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false,
    }
});


categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});


// Hacemos la exportación
module.exports = mongoose.model('Categoria', categoriaSchema)