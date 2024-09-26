require('dotenv').config();
const express = require('express');
const authRoutes = require('./src/routes/authRoutes'); // Rutas de autenticación
const empleadoRoutes = require('./src/routes/empleadoRoutes'); // Rutas de empleados
const solicitudRoutes = require('./src/routes/solicitudRoutes'); // Rutas de solicitudes
const verifyToken = require('./src/middleware/authMiddleware'); // Middleware de autenticación
const dotenv = require('dotenv'); // Import dotenv
const xss = require('xss-clean');
const cors = require('cors'); // Importa el paquete cors

dotenv.config(); // Cargar las variables de entorno

const app = express();
app.use(cors()); // Usa el middleware de cors
app.use(express.json());
// Usar xss-clean para sanear entradas
app.use(xss());

// Rutas públicas (registro y login)
app.use('/api/auth', authRoutes);

// Rutas protegidas (empleados y solicitudes)
app.use('/api/empleados', verifyToken, empleadoRoutes);
app.use('/api/solicitudes', verifyToken, solicitudRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});