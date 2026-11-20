import pool from '../databases/postgres';
import reserva from './interface';

export default class ReservaDao{
    async getAll(id_usuario?: number){
        if(id_usuario !== undefined){
            const response = await pool.query('select * from reserva where id_usuario = $1 order by fecha_inicio', [id_usuario]);
            return response.rows;
        }
        const response = await pool.query('select * from reserva order by fecha_inicio');
        return response.rows;
    }

    async create(data: reserva, id_usuario: number){
        const response = await pool.query(
            `insert into reserva(id_usuario, id_recurso, fecha_inicio, fecha_fin)
             select $1, id, $3, $4 from recurso
             where id = $2 and estado = 'Disponible' and not exists (
                 select 1 from reserva where id_recurso = recurso.id and estado in ('pendiente', 'aprobada')
                 and fecha_inicio < $4 and fecha_fin > $3
             ) returning *`,
            [id_usuario, data.id_recurso, data.fecha_inicio, data.fecha_fin]
        );
        return response.rows[0];
    }

    async update(id: number, estado: string, id_usuario: number, rol: string){
        const response = await pool.query(`update reserva set estado = $1 where id = $2
             and ($4 = 'Administrador' or (id_usuario = $3 and $1 = 'cancelada')) returning *`,
            [estado, id, id_usuario, rol]);
        return response.rows[0];
    }
}
