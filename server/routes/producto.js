const express = require('express');
const Producto = require('../models/producto');
const { verificaToken, verifica_ADMINROL } = require('../middlewares/autenticar');
const app = express();

//realizar consulta masiva solo tiene en cuenta si el producto se encuentra activo cuenta con paginacion 
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ habilitado: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email telefono')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            Producto.countDocuments({ habilitado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cantidad: conteo
                });
            })
        })

});
// realiza la busqueda filtrando por medio del id
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, { habilitado: true })
        .populate('usuario', 'nombre email telefono')
        .exec((err, productoDB) => {
            if (err) { return res.status(500).json({ ok: false, err }); }

            if (!productoDB) { return res.status(400).json({ ok: false, err }); }

            res.json({ ok: true, producto: productoDB });
        });
});
// realiza busqueda por medio de una fraccion del nombre
app.get('/producto/buscar/:filtro', verificaToken, (req, res) => {
    let filtro = req.params.filtro;
    let condicion = new RegExp(filtro, 'i');

    Producto.find({ nombre: condicion })
        .populate('usuario', 'nombre email telefono')
        .exec((err, productoDB) => {
            if (err) { return res.status(500).json({ ok: false, err }); }

            if (!productoDB) { return res.status(400).json({ ok: false, err }); }

            res.json({ ok: true, producto: productoDB });
        });
});
// realiza insercion del producto en el sistema validando si el usuario que hace el grabado es administrado
app.post('/producto', [verificaToken, verifica_ADMINROL], (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        cantidadexistente: body.cantidad,
        preciouni: body.precio
    });
    // realiza el grabado
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
// realiza actualizacion del producto con el id del producto y si el usuario es administrador
app.put('/producto/:id', [verificaToken, verifica_ADMINROL], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        //validacion si el id del producto es valido
        if (!productoDB) {
            return res.status(400).json({ ok: false, err: { message: 'El ID no existe' } });
        }
        //captura de los cambios sobre los valores ya existentes
        productoDB.usuario = req.usuario._id;
        productoDB.nombre = body.nombre;
        productoDB.cantidadexistente = body.cantidad;
        productoDB.preciouni = body.precio;
        //grabado
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    });
});
//realiza eliminacion del producto segun el id y si el usuario es administrador
app.delete('/producto/:id', [verificaToken, verifica_ADMINROL], (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'ID no existe' }
            });
        }
        productoDB.habilitado = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado
            });
        });

    });
});

module.exports = app;