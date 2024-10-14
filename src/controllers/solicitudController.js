// controllers/solicitudController.js
const Solicitud = require('../models/solicitud');
const Empleado = require('../models/empleado');
const validateSolicitud = require('../validators/solicitudValidator');
const { validateNombre } = require('../validators/empleadoValidator');
const sanitizeInput = require('../validators/sanitizeInput');
const unescapeInput = require('../validators/unescapeInput');

class SolicitudController {
    static async crearSolicitud(req, res) {
        let { codigo, descripcion, resumen, id_empleado } = req.body;

        // Validar los datos
        const validation = validateSolicitud({ codigo, descripcion, resumen, id_empleado });
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Sanear las entradas
        codigo = sanitizeInput(codigo);
        descripcion = sanitizeInput(descripcion);
        resumen = sanitizeInput(resumen);

        try {
            const solicitud = await Solicitud.crearSolicitud({ codigo, descripcion, resumen, id_empleado });
            res.status(201).json(solicitud);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async obtenerSolicitudes(req, res) {
        try {
            const solicitudes = await Solicitud.obtenerSolicitudes();

             // Aplicar unescapeInput a descripcion y resumen para cada solicitud
        const solicitudesProcesadas = solicitudes.map(solicitud => ({
            ...solicitud,
            descripcion: unescapeInput(solicitud.descripcion),
            resumen: unescapeInput(solicitud.resumen)
        }));

            res.status(200).json(solicitudesProcesadas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async eliminarSolicitud(req, res) {
        try {
            const { id } = req.params;
            // Verificar si la solicitud existe
            const solicitudExistente = await Solicitud.obtenerSolicitudPorId(id);
            if (!solicitudExistente) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }
            await Solicitud.eliminarSolicitud(id);
            res.status(200).json({ message: 'Solicitud eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSolicitudesByEmpleadoNombre(req, res) {
        let { nombre } = req.body; // Obtener nombre del cuerpo de la solicitud
        // Validar el nombre del empleado
        const validation = validateNombre(nombre);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Sanear las entradas
        nombre = sanitizeInput(nombre);
        try {
            // Verificar si el empleado existe
            const empleado = await Empleado.findByNombre(nombre);
            if (!empleado) {
                return res.status(404).json({ message: 'Empleado no encontrado.' });
            }


            const solicitudes = await Solicitud.findByEmpleadoNombre(nombre);
            if (solicitudes.length === 0) {
                return res.status(404).json({ message: 'No se encontraron solicitudes para este empleado.' });
            }
            res.status(200).json(solicitudes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SolicitudController;
