const { response } = require('express');

const Usuario = require('../models/usuario');
const Alumno = require('../models/alumno');

const buscar = async (req, res = response) => {
    // TODO: Paginación

    const busqueda = req.params.busqueda;
    const regEx = new RegExp(busqueda, 'i');

    const [usuarios, alumnos] = await Promise.all([
        Usuario.find({ nombre: regEx }),
        Alumno.find({ nombre: regEx })
            .populate('usuario', 'nombre')
            .populate('estado', 'estado')
    ]);
    
    res.json({
            ok: true,
            usuarios,
            alumnos
    });
}

const buscarColeccion = async (req, res = response) => {
    // TODO: Paginación
    const busqueda  = req.params.busqueda;
    const coleccion = req.params.coleccion;
    const regEx     = new RegExp(busqueda, 'i');

    let data = [];

    switch (coleccion) {
        case 'alumnos':
            data = await Alumno.find({ nombre: regEx })
                    .populate('usuario', 'nombre')
                    .populate('estado', 'estado');
            break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regEx })
            break;
            
        default:
            return res.status(400).json({
                ok: true,
                msg: `La búsqueda de ${ coleccion } no es válida`
            })
        break;       
    }

    res.json({
        ok: true,
        resultados: data
    });
}

module.exports = {
    buscar,
    buscarColeccion
}