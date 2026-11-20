import RecursoDao from './dao';
import recurso from './interface';
import AuditoriaDao from '../auditoria/dao';

export default class RecursoService{
    private dao = new RecursoDao();
    private auditoria = new AuditoriaDao();

    async getDisponibles(inicio: string, fin: string){
        return await this.dao.getDisponibles(inicio, fin);
    }

    async getAll(){
        return await this.dao.getAll();
    }

    async create(data: recurso, id_usuario: number){
        const recurso = await this.dao.create(data);
        await this.auditoria.create({id_usuario, accion: 'crear', detalles: 'Se creo el recurso', entidad: 'recurso', id_entidad: recurso.id});
        return recurso;
    }

    async update(id: number, data: recurso, id_usuario: number){
        const recurso = await this.dao.update(id, data);
        if(!recurso) return;
        await this.auditoria.create({id_usuario, accion: 'editar', detalles: 'Se edito el recurso', entidad: 'recurso', id_entidad: id});
        return recurso;
    }

    async delete(id: number, id_usuario: number){
        const recurso = await this.dao.delete(id);
        if(!recurso) return;
        await this.auditoria.create({id_usuario, accion: 'eliminar', detalles: 'Se elimino el recurso', entidad: 'recurso', id_entidad: id});
        return recurso;
    }
}
