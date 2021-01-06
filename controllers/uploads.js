const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpload = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipos
    const tiposValidos = ['usuarios', 'alumnos'];
    if ( !tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo no es válido'
        })
    }

    // Validar que exista archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se especificó ningún archivo'
        });
    }

    // Procesar la imagen
    const file = req.files.archivo;
    const nombreCortado = file.name.split('.');

    // Validar extensión
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1];
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.indexOf(extensionArchivo)){
        return res.status(400).json({
            ok: false,
            msg: 'Tipo de archivo no válido'
        });
    }

    // Generar nombre de archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar el archivo
    const path = `./upload/${tipo}/${nombreArchivo}`;
    // Mover la imagen
    file.mv( path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar la BD
        actualizarImagen(tipo, id, nombreArchivo);
    
        res.json({
            ok: true,
            msg: 'Archivo subido correctamente',
            nombreArchivo
        });
      });

}

const getImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const archivo = req.params.archivo;

    const pathArchivo = path.join( __dirname, `../upload/${tipo}/${archivo}`);

    if ( fs.existsSync(pathArchivo) ) {
        res.sendFile( pathArchivo );
    } else {
        const pathArchivo = path.join( __dirname, `../upload/sinfoto.png`);
        res.sendFile( pathArchivo );
    }

}

module.exports = {
    fileUpload,
    getImagen
}