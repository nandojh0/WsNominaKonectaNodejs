const Empleado = require('../models/empleado');
const { validateEmpleado, validateNombre } = require('../validators/empleadoValidator');
const sanitizeInput = require('../validators/sanitizeInput');
const logger = require('../utils/logManager');

class EmpleadoController {

    // Método para crear un empleado
    static async crearEmpleado(req, res) {
        let { nombre, fecha_ingreso, salario } = req.body;
        const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Validar los datos del empleado
        const validation = validateEmpleado({ nombre, fecha_ingreso, salario });
        if (!validation.isValid) {
            logger.logTransactionInfo(`Datos de empleado inválidos: ${JSON.stringify(req.body)} desde IP: ${clientIP}`);
            return res.status(400).json({ message: validation.message });
        }

        // Sanear las entradas
        nombre = sanitizeInput(nombre);
        fecha_ingreso = sanitizeInput(fecha_ingreso);

        try {
            const empleado = await Empleado.crearEmpleado({ nombre, fecha_ingreso, salario });
            logger.logTransactionInfo(`Empleado creado: ${JSON.stringify(empleado)} desde IP: ${clientIP}`);
            res.status(201).json(empleado);
        } catch (error) {
            logger.logTransactionError(`Error en EmpleadoController/crearEmpleado(): ${error.message}`, error);
            res.status(500).json({ error: error.message });
        }
    }

    // Método para obtener la lista de empleados
    static async obtenerEmpleados(req, res) {
        const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        try {
            const empleados = await Empleado.obtenerEmpleados();
            logger.logTransactionInfo('Lista de empleados obtenida exitosamente desde IP: ' + clientIP);
            res.status(200).json(empleados);
        } catch (error) {
            logger.logTransactionError(`Error en EmpleadoController/obtenerEmpleados(): ${error.message}`, error);
            res.status(500).json({ error: error.message });
        }
    }

    // Método para buscar un empleado por nombre
    static async findByNombre(req, res) {
        const { nombre } = req.body;
        const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const validation = validateNombre(nombre);
        if (!validation.isValid) {
            logger.logTransactionInfo(`Nombre inválido recibido: ${nombre} desde IP: ${clientIP}`);
            return res.status(400).json({ message: validation.message });
        }

        const sanitizedNombre = sanitizeInput(nombre);

        try {
            const empleado = await Empleado.findByNombre(sanitizedNombre);
            if (empleado) {
                logger.logTransactionInfo(`Empleado encontrado: <*${JSON.stringify(empleado)}*> desde IP: ${clientIP}`);
                return res.status(200).json(empleado);
            } else {
                logger.logTransactionInfo(`Empleado no encontrado: ${sanitizedNombre} desde IP: ${clientIP}`);
                return res.status(404).json({ message: 'Empleado no encontrado' });
            }
        } catch (error) {
            logger.logTransactionError(`Error en EmpleadoController/findByNombre(): ${error.message}`, error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = EmpleadoController;
