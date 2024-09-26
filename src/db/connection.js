// src/db/connection.js
const { Pool } = require('pg');
require('dotenv').config(); // Carga las variables de entorno
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true, 
        ca: fs.readFileSync(path.join(__dirname, '../certs/ca.pem')).toString()// Certificado CA
    }
});

module.exports = pool;
