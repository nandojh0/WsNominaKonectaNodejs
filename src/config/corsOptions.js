// /src/config/corsOptions.js
const cors = require('cors');
require('dotenv').config();

const allowedOrigins = [
    process.env.URL_FRONTEND_DEV, // Origen del frontend en desarrollo
    process.env.URL_FRONTEND_PDN, // Origen del frontend en producción
];

const corsOptions = {
    origin: (origin, callback) => {
        // Permite solicitudes sin origen (por ejemplo, herramientas como Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};

module.exports = cors(corsOptions);
