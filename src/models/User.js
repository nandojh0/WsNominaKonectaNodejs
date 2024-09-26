// models/User.js
const pool = require('../db/connection');
const bcrypt = require('bcryptjs');

const User = {
    create: async (username, password) => {
        // Hashea la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        return result.rows[0]; // Devuelve el usuario creado
    },

    findByUsername: async (username) => {
        // Busca un usuario por su nombre de usuario
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE username = $1',
            [username]
        );
        return result.rows[0]; // Devuelve el usuario si existe
    },
};

module.exports = User;
