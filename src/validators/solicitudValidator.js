const validator = require('validator');

const validateSolicitud = ({ codigo, descripcion, resumen, id_empleado }) => {
    const errors = [];

    // Validar el código
    if (!codigo || !validator.isAlphanumeric(codigo) || codigo.length > 50) {
        errors.push('Código: inválido. Debe ser alfanumérico y no exceder los 50 caracteres.');
    }

    // Validar la descripción
    if (!descripcion || typeof descripcion !== 'string' || descripcion.length > 50) {
        errors.push('Descripción: inválida. Debe ser una cadena de texto y no exceder los 50 caracteres.');
    }

    // Validar el resumen
    if (!resumen || typeof resumen !== 'string' || resumen.length > 50) {
        errors.push('Resumen: inválido. Debe ser una cadena de texto y no exceder los 50 caracteres.');
    }

    // Validar el ID del empleado
    if (!id_empleado || !validator.isNumeric(id_empleado.toString())) {
        errors.push('ID de empleado: inválido, Debe ser un número.');
    }

    return {
        isValid: errors.length === 0,
        message: errors.length > 0 ? errors.join(' ') : ''
    };
};

module.exports = validateSolicitud;
