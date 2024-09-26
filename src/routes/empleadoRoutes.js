// routes/empleadoRoutes.js
const express = require('express');
const EmpleadoController = require('../controllers/empleadoController');

const router = express.Router();

router.post('/', EmpleadoController.crearEmpleado);
router.get('/', EmpleadoController.obtenerEmpleados);
router.post('/nombre', EmpleadoController.findByNombre);

module.exports = router;
