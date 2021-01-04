const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email});
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: ';)',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar el usuario en BD
        await usuario.save();
        
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id )


        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
    // Obtengo el usuario por UID
    const usuarioDB = await Usuario.findById(uid);
    // Generar el TOKEN - JWT
    const token = await generarJWT( uid )

    res.json({
        ok: true,
        token,
        usuario: usuarioDB
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}