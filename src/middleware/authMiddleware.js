// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado' });
    }
    // Elimina "Bearer " para obtener solo el token
    const actualToken = token.split(' ')[1];
    try {
        // Verifica el token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded; // Agrega la información del usuario a la request
        next(); // Llama a la siguiente función
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = verifyToken;
