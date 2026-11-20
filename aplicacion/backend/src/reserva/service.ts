import ReservaDao from './dao';
import reserva from './interface';
import AuditoriaDao from '../auditoria/dao';

export default class ReservaService{
    private dao = new ReservaDao();
    private auditoria = new AuditoriaDao();

    async getAll(id_usuario: number, rol: string){
        if(rol !== 'Administrador') return await this.dao.getAll(id_usuario);
        return await this.dao.getAll();
    }

    async create(data: reserva, id_usuario: number){
        const reserva = await this.dao.create(data, id_usuario);
        if(!reserva) return;
        await this.auditoria.create({id_usuario, accion: 'crear', detalles: 'Se creo una reserva pendiente', entidad: 'reserva', id_entidad: reserva.id});
        return reserva;
    }

    async update(id: number, estado: string, id_usuario: number, rol: string){
        const response = await this.dao.update(id, estado, id_usuario, rol);
        if(!response) return;
        await this.auditoria.create({id_usuario, accion: 'editar', detalles: 'La reserva paso a ' + estado, entidad: 'reserva', id_entidad: id});
        return response;
    }
}
