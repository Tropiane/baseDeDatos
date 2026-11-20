import pool from '../databases/postgres';
import auditoria from './interface';

export default class AuditoriaDao{
    async getAll(){
        const response = await pool.query('select * from auditoria order by fecha desc, id desc');
        return response.rows;
    }

    async create(data: auditoria){
        const {id_usuario, accion, detalles, entidad, id_entidad} = data;
        await pool.query(
            'insert into auditoria(id_usuario, accion, detalles, entidad, id_entidad) values ($1, $2, $3, $4, $5)',
            [id_usuario, accion, detalles, entidad, id_entidad]
        );
    }
}
