// validators/empleadoValidator.js
const validator = require('validator');

const validateEmpleado = (empleado) => {
    const { nombre, fecha_ingreso, salario } = empleado;
    const errors = [];

    // Validación del nombre
    const nombreValidation = validateNombre(nombre);
    if (!nombreValidation.isValid) {
        errors.push(`Nombre: inválido. ${nombreValidation.message}`);
    }
    // Validar la fecha de ingreso
    if (!validator.isDate(fecha_ingreso)) {
        errors.push('Fecha de ingreso: inválida. Debe estar en formato YYYY-MM-DD.');
    }

    // Validar el salario
    if (!validator.isNumeric(salario.toString())) {
        errors.push('Salario: inválido.');
    }

    return {
        isValid: errors.length === 0,
         message: errors.length > 0 ? errors.join(' ') : ''
    };
};

// Método de validación para el nombre
const validateNombre = (nombre) => {
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return {
            isValid: false,
            message: 'El nombre del empleado es requerido y no debe estar vacío.'
        };
    }

    if (!validator.isAlpha(nombre.replace(/\s/g, ''))) {
        return {
            isValid: false,
            message: 'El nombre solo debe contener letras.'
        };
    }

    // Validación de la longitud máxima
    if (nombre.length > 50) {
        return {
            isValid: false,
            message: 'El nombre no puede tener más de 50 caracteres.'
        };
    }

    return { isValid: true };
};

module.exports = {
    validateEmpleado,
    validateNombre
};
