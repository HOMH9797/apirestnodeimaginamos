const express = require('express');
const Pedido = require('../models/pedido');
const Producto = require('../models/producto');
const { verificaToken, verifica_CLIENTROL } = require('../middlewares/autenticar');
const app = express();


app.post('/pedido', verificaToken, (req, res) => {
    let body = req.body;
    let precio = new Number();
    let dat = new Date();
    dat = dat.getTime();
    let tiempofaltante = 1000 * 60 * 60 * body.horaentrega;
    let fechaentrega = new Date();

    fechaentrega = fechaentrega.getTime() + tiempofaltante;

    Producto.findById(body.producto)
        .exec((err, productoDB) => {
            if (err) { return res.status(500).json({ ok: false, err }); }

            if (!productoDB) { return res.status(400).json({ ok: false, err }); }
            precio = body.cantidad * productoDB.preciouni;

            let pedido = new Pedido({
                cliente: req.usuario._id,
                fechaRealizado: dat,
                horasentrega: fechaentrega,
                cantidad: body.cantidad,
                precioglobal: precio,
                estadoCumpliento: body.estado,
                producto: body.producto
            });

            pedido.save((err, pedidoDB) => {
                if (err) {
                    return res.status(400).json({ ok: false, err });
                }
                res.json({ ok: true, pedido: pedidoDB });
            });
        });
});

app.get('/pedido', verificaToken, (req, res) => {
    Pedido.find({ estadoCumpliento: 'PENDIENTE' })
        .populate('cliente', 'nombre email telefono')
        .populate('producto', 'nombre preciouni')
        .exec((err, pedidoDB) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }
            res.json({ ok: true, pedidoDB });
        });
});

app.get('/pedidocliente', [verificaToken, verifica_CLIENTROL], (req, res) => {
    let usua = req.usuario._id;
    Pedido.find({ estadoCumpliento: 'PENDIENTE', cliente: usua })
        .populate('cliente', 'nombre email telefono')
        .populate('producto', 'nombre preciouni')
        .exec((err, pedidoDB) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }
            res.json({ ok: true, pedidoDB });
        });
});

app.delete('/pedido/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Pedido.findById(id, (err, pedidoDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); }
        if (!pedidoDB) { return res.status(400).json({ ok: false, err: { message: 'ID no existe' } }) }

        pedidoDB.estadoCumpliento = 'CANCELADO'

        pedidoDB.save((err, pedidoEstado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                pedido: pedidoEstado
            });
        });
    });
});

app.put('/pedido/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let tiempofaltante = 1000 * 60 * 60 * body.horasentrega;
    let fechaentrega = new Date();

    Pedido.findById(id, (err, pedidoDB) => {
        if (err) { return escape.status(500).json({ ok: false, err }); }
        if (!pedidoDB) { return res.status(400).json({ ok: false, err: { message: 'Este ID no es valido' } }); }
        if (!body.producto) {
            Producto.findById(pedidoDB.producto)
                .exec((err, productoActualizar) => {

                    if (err) { return res.status(500).json({ ok: false, err }); }
                    if (!productoActualizar) { return res.status(400).json({ ok: false, err: { message: 'Este ID no es de producto valido' } }); }
                    fechaentrega = pedidoDB.fechaRealizado;
                    fechaentrega = fechaentrega.getTime() + tiempofaltante;
                    pedidoDB.horasentrega = fechaentrega;

                    if (body.cantidad) {
                        precio = body.cantidad * productoActualizar.preciouni;
                        pedidoDB.cantidad = body.cantidad;
                        pedidoDB.precioglobal = precio;
                    }


                    pedidoDB.save((err, pedidoActualizar) => {
                        if (err) { return res.status(400).json({ ok: false, err }); }
                        res.json({ ok: true, pedido: pedidoActualizar });
                    });
                });
        } else {
            Producto.findById(body.producto)
                .exec((err, productoActualizar) => {

                    if (err) { return res.status(500).json({ ok: false, err }); }
                    if (!productoActualizar) { return res.status(400).json({ ok: false, err: { message: 'Este ID no es de producto valido' } }); }
                    fechaentrega = pedidoDB.fechaRealizado;
                    fechaentrega = fechaentrega.getTime() + tiempofaltante;
                    pedidoDB.horasentrega = fechaentrega;
                    if (body.cantidad) {
                        precio = body.cantidad * productoActualizar.preciouni;
                        pedidoDB.cantidad = body.cantidad;
                        pedidoDB.precioglobal = precio;
                    }
                    pedidoDB.producto = productoActualizar._id;

                    pedidoDB.save((err, pedidoActualizar) => {
                        if (err) { return res.status(400).json({ ok: false, err }); }
                        res.json({ ok: true, pedido: pedidoActualizar });
                    });
                });
        }
    })
})

module.exports = app;