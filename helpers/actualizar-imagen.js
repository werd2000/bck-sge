const fs = require('fs');
const Usuario = require('../models/usuario');
const Alumno = require('../models/alumno');

const borrarImagen = ( path ) => {
    // me fijo si existe la imagen que tiene el usuario segun BD
    if ( fs.existsSync( path )){
        // si existe borro la imagen anterior
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {

    let pathViejo = '';

    switch (tipo) {
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }

            pathViejo = `./uploads/alumnos/${usuario.img}`;
            borrarImagen( pathViejo );

            // Establecemos en nuevo nombre de archivo
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            
            break;
        
        case 'alumnos':
            const alumno = await Alumno.findById(id);
            if (!alumno) {
                return false;
            }

            pathViejo = `./uploads/alumnos/${alumno.img}`;
            borrarImagen( pathViejo );

            // Establecemos en nuevo nombre de archivo
            alumno.img = nombreArchivo;
            await alumno.save();
            return true;

            break

    }

}

module.exports = {
    actualizarImagen
}