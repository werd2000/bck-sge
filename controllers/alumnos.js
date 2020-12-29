const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Alumno = require('../models/alumno');
const EstadoAlumno = require('../models/estadoAlumno');
const { generarJWT } = require('../helpers/jwt');

const getAlumnos = async (req, res = response) => {
    
    const alumnos = await Alumno.find( {}, 'apellido nombre nroDoc fechaNac img estado activo')
                        .populate('usuario', 'nombre')
                        .populate('estado', 'estado');
    res.json({
            ok: true,
            alumnos,
            // ahora va el usuario que hizo la petición
            // viene de validar el jwt
            // uid: req.uid 
    });
}

const crearAlumno = async (req, res = response) => {
    const { nroDoc } = req.body;    

    try {
        const existeNroDoc = await Alumno.findOne({ nroDoc });

        if (existeNroDoc){
            return res.status(400).json({
                ok: false,
                msg: 'El DNI ya está registrado'
            });
        }

        const uid = req.uid;
        const alumno = new Alumno({ usuario: uid, ...req.body });

        // Guardo usuario
        await alumno.save();

        res.json({
                ok: true,
                alumno
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
        
    }

}

const actualizarAlumno = async (req, res = response ) => {
    // TODO: validar TOKEN y si es usuario permitido

    const id = req.params.id;

    try {

        const alumnoDB = await Alumno.findById( id );
        // Si no encuentra el alumno muestro error
        if ( !alumnoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un alumno con ese Id'
            });
        }
        
        const { estado, nroDoc, ...campos} = req.body;

        console.log(estado);
        const estadoAlumnoDB = await EstadoAlumno.findById( estado );
        // Si no encuentra el estadoAlumno muestro error
        if ( !estadoAlumnoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un estado con ese Id'
            });
        }

        // Actualizar

        // Si el mismo dni es diferente es porque quiere modificar el dni
        if (alumnoDB.nroDoc !== nroDoc ){
            const existeDni = await Alumno.findOne({ nroDoc });
            if ( existeDni ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un alumno con ese DNI'
                }); 
            }
        }

        campos.nroDoc = nroDoc;
        campos.estado = estado;
        const alumnoActualizado = await Alumno.findByIdAndUpdate( id, campos, { new: true });

        res.json({
            ok: true,
            alumno: alumnoActualizado
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarAlumno = async (req, res = response) => {
    
    const id = req.params.id;

    try {
        const alumnoDB = await Alumno.findById( id );

        // Si no encuentra el alumno muestro error
        if ( !alumnoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un alumno con ese Id'
            });
        }

        // Usar este para borrado físico
        // await Alumno.findByIdAndDelete(id);

        // Usar este para borrado lógico
        const { ...campos } = req.body;
        campos.activo = false;
        const alumnoActualizado = await Alumno.findByIdAndUpdate( id, campos, { new: true });

        res.status(200).json({
            ok: true,
            msg: 'Alumno eliminado '
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
    getAlumnos,
    crearAlumno,
    actualizarAlumno,
    borrarAlumno,
}