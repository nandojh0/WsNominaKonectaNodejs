// models/empleado.js
const pool = require('../db/connection');

class Empleado {
    static async crearEmpleado(empleado) {
        const { fecha_ingreso, nombre, salario } = empleado;
        const query = 'INSERT INTO empleado (fecha_ingreso, nombre, salario) VALUES ($1, $2, $3) RETURNING *';
        const values = [fecha_ingreso, nombre, salario];
        const res = await pool.query(query, values);
        return res.rows[0];
    }

    static async obtenerEmpleados() {
        const query = 'SELECT * FROM empleado';
        const res = await pool.query(query);
        return res.rows.length > 0 ? res.rows : []; // Retorna un array vacío si no hay empleados
    }

    static async findByNombre(nombre) {
        const result = await pool.query(
            'SELECT * FROM empleado WHERE nombre = $1',
            [nombre]
        );
        return result.rows.length > 0 ? result.rows[0] : null; // Retorna null si no se encuentra, si encuentra Retorna el primer empleado encontrado
    }
}

module.exports = Empleado;
