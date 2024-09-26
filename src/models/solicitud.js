// models/solicitud.js
const pool = require('../db/connection');

class Solicitud {
    static async crearSolicitud(solicitud) {
        const { codigo, descripcion, resumen, id_empleado } = solicitud;
        const query = 'INSERT INTO solicitud (codigo, descripcion, resumen, id_empleado) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [codigo, descripcion, resumen, id_empleado];
        const res = await pool.query(query, values);
        return res.rows[0];
    }

    static async obtenerSolicitudes() {
        const query = 'SELECT s.id AS solicitud_id, s.codigo, s.descripcion, s.resumen, e.nombre FROM solicitud s JOIN empleado e ON s.id_empleado = e.id;';
        const res = await pool.query(query);
        return res.rows;
    }

    static async eliminarSolicitud(id) {
        const query = 'DELETE FROM solicitud WHERE id = $1 RETURNING *';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }

    static async findByEmpleadoNombre(nombre){
        const result = await pool.query(`
            SELECT s.id AS solicitud_id, s.codigo, s.descripcion, s.resumen 
            FROM solicitud s
            JOIN empleado e ON s.id_empleado = e.id
            WHERE e.nombre = $1`, [nombre]);
        return result.rows;
    }

}

module.exports = Solicitud;
