const jwt = require('jsonwebtoken');


// VERIFICAR TOKEN 

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token no valido',
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

let verifica_ADMINROL = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: { message: 'El usuario no puede realizar esta terea ya que no es administrador' }
        })
    }

};

let verifica_CLIENTROL = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'CLIENT_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: { message: 'El usuario no puede realizar esta terea ya que no es Cliente' }
        })
    }

};

let verifica_CLIENTADMINROL = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'CLIENT_ROLE' || usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: { message: 'El usuario no puede realizar esta terea ya que no es Cliente o administrador' }
        })
    }

};

let verifica_DRIVERROL = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'DRIVER_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: { message: 'El usuario no puede realizar esta terea ya que no es Driver' }
        })
    }

};

module.exports = {
    verificaToken,
    verifica_ADMINROL,
    verifica_CLIENTROL,
    verifica_CLIENTADMINROL
}