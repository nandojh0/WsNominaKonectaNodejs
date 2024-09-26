// routes/solicitudRoutes.js
const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');


// Rutas protegidas
router.get('/', solicitudController.obtenerSolicitudes);
router.post('/', solicitudController.crearSolicitud);
router.delete('/:id', solicitudController.eliminarSolicitud);
router.post('/por-empleado', solicitudController.getSolicitudesByEmpleadoNombre);

module.exports = router;
