// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../validators/userValidator');
const sanitizeInput = require('../validators/sanitizeInput');

exports.register = async (req, res) => {
    let { username, password } = req.body;


    username = sanitizeInput(username);
    password = sanitizeInput(password);

    // Validate user input
    const { isValid, message } = validateUser({ username, password });
    if (!isValid) {
        return res.status(400).json({ message });
    }
    try {
        // Verifica si el usuario ya existe
        const userExists = await User.findByUsername(username);
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crea el usuario usando el modelo
        const newUser = await User.create(username, password);
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el registro' });
    }
};

exports.login = async (req, res) => {
    let { username, password } = req.body;

    username = sanitizeInput(username);
    password = sanitizeInput(password);

    // Validate user input
    const { isValid, message } = validateUser({ username, password });
    if (!isValid) {
        return res.status(400).json({ message });
    }
    try {
        // Busca al usuario por su nombre de usuario
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(400).json({ message: 'Usuario no registrado' });
        }

        // Compara la contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Genera el token JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el login' });
    }
};

