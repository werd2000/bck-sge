const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
    
    const usuarios = await Usuario.find( {}, 'nombre email role google activo');
    res.json({
            ok: true,
            usuarios,
            // ahora va el usuario que hizo la petición
            // viene de validar el jwt
            // uid: req.uid 
    });
}

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;    

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El Email ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt );

        // Guardo usuario
        await usuario.save();

        // Generar el TOKEN - JWT --- Esto solo en el caso que quiera iniciar sesión con la
        // creación del usuario
        // En ese caso devolver el token
        // const token = await generarJWT( usuario.id )

        res.json({
                ok: true,
                usuario,
                // token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
        
    }

}

const actualizarUsuario = async (req, res = response ) => {
    // TODO: validar TOKEN y si es usuario correcto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        // Si no encuentra el usuario muestro error
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id'
            });
        }

        // Actualizar
        const { password, google, email, ...campos} = req.body;

        // Si el mismo email es diferente es porque quiere modificar el email
        if (usuarioDB.email !== email ){
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                }); 
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async (req, res = response) => {
    
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );

        // Si no encuentra el usuario muestro error
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id'
            });
        }

        // Usar este para borrado físico
        // await Usuario.findByIdAndDelete(uid);

        // Usar este para borrado lógico
        const { ...campos } = req.body;
        campos.activo = false;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true });

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado '
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}