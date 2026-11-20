import pool from '../databases/postgres';
import recurso from './interface';

export default class RecursoDao{
    async getDisponibles(inicio: string, fin: string){
        const response = await pool.query(
            `select * from recurso where estado = 'Disponible' and not exists (
                select 1 from reserva where id_recurso = recurso.id and estado in ('pendiente', 'aprobada')
                and fecha_inicio < $2 and fecha_fin > $1
            ) order by id`, [inicio, fin]
        );
        return response.rows;
    }

    async getAll(){
        const response = await pool.query('select * from recurso order by id');
        return response.rows;
    }

    async create(data: recurso){
        const response = await pool.query(
            'insert into recurso(nombre, estado, detalles) values ($1, $2, $3) returning *',
            [data.nombre, data.estado ?? 'Disponible', data.detalles]
        );
        return response.rows[0];
    }

    async update(id: number, data: recurso){
        const response = await pool.query(
            'update recurso set nombre = $1, estado = coalesce($2, estado), detalles = case when $3 then $4 else detalles end where id = $5 returning *',
            [data.nombre, data.estado, data.detalles !== undefined, data.detalles, id]
        );
        return response.rows[0];
    }

    async delete(id: number){
        const response = await pool.query('delete from recurso where id = $1 returning *', [id]);
        return response.rows[0];
    }
}
