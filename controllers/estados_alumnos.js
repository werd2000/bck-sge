const { response } = require('express');

const EstadoAlumno = require('../models/estadoAlumno');

const getEstadosAlumnos = async (req, res = response) => {
    
    const estadosAlumnos = await EstadoAlumno.find( {}, 'estado activo');
    res.json({
            ok: true,
            estados: estadosAlumnos,
            // ahora va el usuario que hizo la petición
            // viene de validar el jwt
            // uid: req.uid 
    });
}

const crearEstadoAlumno = async (req, res = response) => {
    // TODO: validar TOKEN y si es usuario permitido
    const { estado } = req.body;    

    try {
        const existeEstado = await EstadoAlumno.findOne({ estado });

        if (existeEstado){
            return res.status(400).json({
                ok: false,
                msg: 'El estado ya existe'
            });
        }

        const uid = req.uid;
        const estadAlumno = new EstadoAlumno({ usuario: uid, ...req.body });

        // Guardo usuario
        await estadAlumno.save();

        res.json({
                ok: true,
                estado: estadAlumno
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
        
    }

}

const actualizarEstadoAlumno = async (req, res = response ) => {
    // TODO: validar TOKEN y si es usuario permitido

    const id = req.params.id;

    try {

        const estadoAlumnoDB = await EstadoAlumno.findById( id );

        // Si no encuentra el estado muestro error
        if ( !estadoAlumnoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un estado con ese Id'
            });
        }

        // Actualizar
        const estadoAlumnoActualizado = await EstadoAlumno.findByIdAndUpdate( id, req.body, { new: true });

        res.json({
            ok: true,
            estado: estadoAlumnoActualizado
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


const borrarEstadoAlumno = async (req, res = response) => {
    
    const id = req.params.id;

    try {
        const estadoAlumnoDB = await EstadoAlumno.findById( id );

        // Si no encuentra el estado muestro error
        if ( !estadoAlumnoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un estado con ese Id'
            });
        }

        // Usar este para borrado físico
        // await Alumno.findByIdAndDelete(id);

        // Usar este para borrado lógico
        const { ...campos } = req.body;
        campos.activo = false;
        const estadoAlumnoActualizado = await EstadoAlumno.findByIdAndUpdate( id, campos, { new: true });

        res.status(200).json({
            ok: true,
            msg: 'Estado de Alumno eliminado '
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
    getEstadosAlumnos,
    crearEstadoAlumno,
    actualizarEstadoAlumno,
    borrarEstadoAlumno,
}