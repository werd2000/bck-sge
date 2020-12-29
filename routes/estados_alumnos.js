/*
    Ruta: api/estados_alumnos
*/
const { Router } = require ('express'); 
const { check } = require ('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getEstadosAlumnos,
    crearEstadoAlumno,
    borrarEstadoAlumno,
    actualizarEstadoAlumno } = require ('../controllers/estados_alumnos');

const router = Router();

router.get( '/', getEstadosAlumnos);

// Llamar a los middlewares personalizados después de los check
router.post( '/', [
    validarJWT
    ],
    crearEstadoAlumno);

router.put( '/:id', [
    validarJWT
    ],
    actualizarEstadoAlumno);

router.delete( '/:id', [
    validarJWT
    ],
    borrarEstadoAlumno);

module.exports = router;