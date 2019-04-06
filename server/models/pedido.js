const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let pedidoSchema = new Schema({
    fechaRealizado: { type: Date, required: true },
    entrega: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    precioglobal: { type: Number, required: true },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', },
    cliente: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Pedido', pedidoSchema);