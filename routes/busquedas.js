/*
    Ruta: api/buscar/:busqueda
*/
const { Router } = require ('express'); 

const { validarJWT } = require('../middlewares/validar-jwt');

const { buscar, buscarColeccion } = require ('../controllers/busquedas');

const router = Router();

router.get( '/:busqueda', validarJWT, buscar);
router.get( '/:coleccion/:busqueda', validarJWT, buscarColeccion);


module.exports = router;