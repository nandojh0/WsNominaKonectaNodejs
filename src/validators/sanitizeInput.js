const validator = require('validator');

// Función para sanear las entradas de datos
const sanitizeInput = (input) => {
    return validator.escape(input); // Escapa caracteres peligrosos como <, >, &, etc.
};

module.exports = sanitizeInput;
