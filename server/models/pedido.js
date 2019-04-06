const mongoose = require('mongoose');
let estadosValidos = { values: ['CANCELADO', 'PENDIENTE', 'CUMPLIDO'], message: '{VALUE} No es un estado valido' };


let Schema = mongoose.Schema;
let pedidoSchema = new Schema({
    fechaRealizado: { type: Date, required: true },
    horasentrega: { type: Date, required: true },
    cantidad: { type: Number, required: true },
    precioglobal: { type: Number, required: true },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', },
    estadoCumpliento: { type: String, default: 'PENDIENTE', enum: estadosValidos },
    cliente: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Pedido', pedidoSchema);