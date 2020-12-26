const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async ( req, res = response ) => {

    // A este punto pasó la validación y tengo datos
    const { email, password } = req.body;

    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });
    if ( !usuarioDB ) {
        return res.status(404).json({
            ok: false,
            msg: 'Email inválido'
        })
    }

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync( password, usuarioDB.password );
    if (!validPassword) {
        return res.status(400).json({
            ok: false,
            msg: 'Password inválido'
        })
    }

    // Verificar usuario activo
    if ( !usuarioDB.activo ) {
        return res.status(404).json({
            ok: false,
            msg: 'Usuario inválido'
        })
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT( usuarioDB.id )

    try {
        res.status(200).json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
        
    }
}

module.exports = {
    login
}