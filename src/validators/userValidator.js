// validators/userValidator.js
const validator = require('validator');

const validateUser = (user) => {
    const { username, password } = user;
    const errors = [];

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        errors.push(`Username: ${usernameValidation.message}`);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        errors.push(`Password: ${passwordValidation.message}`);
    }

    return {
        isValid: errors.length === 0,
        message: errors.length > 0 ? errors.join(' ') : ''
    };
};

// Validation method for username
const validateUsername = (username) => {
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        return {
            isValid: false,
            message: 'El nombre de usuario es requerido y no debe estar vacío.'
        };
    }

    if (!validator.isAlphanumeric(username)) {
        return {
            isValid: false,
            message: 'El nombre de usuario debe ser alfanumérico.'
        };
    }

    // Maximum length validation
    if (username.length > 30) {
        return {
            isValid: false,
            message: 'El nombre de usuario no puede tener más de 30 caracteres.'
        };
    }

    return { isValid: true };
};

// Validation method for password
const validatePassword = (password) => {
    if (!password || typeof password !== 'string' || password.trim().length === 0) {
        return {
            isValid: false,
            message: 'La contraseña es requerida y no debe estar vacía.'
        };
    }

    if (!validator.isLength(password, { min: 6, max: 50 })) {
        return {
            isValid: false,
            message: 'La contraseña debe tener al menos 6  y 50 caracteres.'
        };
    }

    return { isValid: true };
};

module.exports = {
    validateUser,
    validateUsername,
    validatePassword
};
