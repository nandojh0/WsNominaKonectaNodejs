// controllers/empleadoController.js
const Empleado = require('../models/empleado');
const { validateEmpleado,validateNombre } = require('../validators/empleadoValidator');
const sanitizeInput = require('../validators/sanitizeInput');

class EmpleadoController {
    static async crearEmpleado(req, res) {
        let { nombre, fecha_ingreso, salario } = req.body;

        // Validar los datos
        const validation = validateEmpleado({ nombre, fecha_ingreso, salario });
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }
        // Sanear las entradas
        nombre = sanitizeInput(nombre);
        fecha_ingreso = sanitizeInput(fecha_ingreso);

        try {
            const empleado = await Empleado.crearEmpleado({ nombre, fecha_ingreso, salario });
            res.status(201).json(empleado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async obtenerEmpleados(req, res) {
        try {
            const empleados = await Empleado.obtenerEmpleados();
            res.status(200).json(empleados);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async findByNombre(req, res) {
        const { nombre } = req.body;

        // Validar el nombre del empleado
        const validation = validateNombre(nombre);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Sanear la entrada
        const sanitizedNombre = sanitizeInput(nombre);

        try {
            const empleado = await Empleado.findByNombre(sanitizedNombre);
            if (empleado) {
                return res.status(200).json(empleado);
            } else {
                return res.status(404).json({ message: 'Empleado no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = EmpleadoController;
