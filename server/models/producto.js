const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let productoSchema = new Schema({
    nombre: { type: String, require: [true, 'El nombre para el producto es necesario'] },
    cantidadexistente: { type: Number, require: [true, 'La cantidad para el producto es necesario'] },
    preciouni: { type: Number, require: [true, 'La precio para el producto es necesario'] },
    habilitado: { type: Boolean, default: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Producto', productoSchema);