/*
    Ruta: api/alumnos
*/
const { Router } = require ('express'); 
const { check } = require ('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getAlumnos, crearAlumno, actualizarAlumno, borrarAlumno } = require ('../controllers/alumnos');

const router = Router();

router.get( '/', getAlumnos);

// Llamar a los middlewares personalizados después de los check
router.post( '/', [
    validarJWT,
    check('apellido', 'El apellido es necesario').not().isEmpty(),
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('nroDoc', 'El número de documento es necesario').not().isEmpty(),
    check('estado', 'El id del estado debe ser válido').isMongoId(),
    validarCampos
    ],
    crearAlumno);

router.put( '/:id', [
    validarJWT,
    check('apellido', 'El apellido es necesario').not().isEmpty(),
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('nroDoc', 'El número de documento es necesario').not().isEmpty(),
    check('estado', 'El id del estado debe ser válido').isMongoId(),
    validarCampos
    ],
    actualizarAlumno);

router.delete( '/:id', [
    validarJWT
    ],
    borrarAlumno);

module.exports = router;