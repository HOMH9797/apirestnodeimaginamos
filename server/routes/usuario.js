const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verifica_ADMINROL } = require('../middlewares/autenticar');
const app = express();

//Metodo GET permite obtener la informacion conrespondiente a cada usuario del aplicativo con paginacion
app.get('/usuario', [verificaToken, verifica_ADMINROL], (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                });
            })
        })
});

//Metodo POST permite hacer la insercion de nuevos usuarios en base de datos
app.post('/usuario', verificaToken, function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        telefono: body.telefono,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

//Metodo PUT permite hacer actualizaciones a los usuarios por medio de su ID
app.put('/usuario/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    // Restringe las propiedades del usuario que se permiten editar por esta via
    let body = _.pick(req.body, ['nombre', 'email', 'telefono', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

//Metodo DELETE realiza la inactivacion de los usuarios como "borrado" del sistema pormedio del ID
app.delete('/usuario/:id', [verificaToken, verifica_ADMINROL], (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;