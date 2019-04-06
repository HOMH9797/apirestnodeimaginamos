const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = { values: ['ADMIN_ROLE', 'CLIENT_ROLE', 'DRIVER_ROLE'], message: '{VALUE} No es un rol valido' };

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    role: { type: String, default: 'CLIENT_ROLE', enum: rolesValidos },
    estado: { type: Boolean, default: true },
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);