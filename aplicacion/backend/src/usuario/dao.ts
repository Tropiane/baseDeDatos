import pool from '../databases/postgres';
import AuditoriaDao from '../auditoria/dao';
import {user} from './interface';

export default class UserDao{
    private auditoria = new AuditoriaDao();

    async getAll(){
        const response = await pool.query('select id, nombre, edad, correo, telefono, estado, rol from usuario order by id');
        return response.rows;
    }

    async findEmail(correo: string){
        const response = await pool.query('select id, contrasena, estado from usuario where correo = $1', [correo]);
        return response.rows;
    }

    async create(data: user){
        const {nombre, edad, correo, contrasena, telefono} = data;
        const response = await pool.query(
            'insert into usuario(nombre, edad, correo, contrasena, telefono) values ($1, $2, $3, $4, $5) returning id, nombre, edad, correo, telefono, estado, rol',
            [nombre, edad, correo, contrasena, telefono]
        );
        const id = response.rows[0].id;
        await this.auditoria.create({id_usuario: id, accion: 'crear', detalles: 'Se registro el usuario', entidad: 'usuario', id_entidad: id});
        return response.rows;
    }

    async delete(id: number, id_usuario: number){
        //Desactivo el usuario para conservar sus reservas y el historial
        const response = await pool.query('update usuario set estado = false where id = $1 and estado = true returning id, nombre, estado', [id]);
        if(!response.rows[0]) return [];
        await this.auditoria.create({id_usuario, accion: 'editar', detalles: 'Se desactivo el usuario', entidad: 'usuario', id_entidad: id});
        return response.rows;
    }
}
