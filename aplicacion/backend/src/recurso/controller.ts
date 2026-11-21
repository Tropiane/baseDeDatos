import {Request, Response} from 'express';
import RecursoService from './service';

export default class RecursoController{
    private service = new RecursoService();

    async getDisponibles(req: Request, res: Response){
        try {
            if(!req.query.fecha_inicio || !req.query.fecha_fin) return res.status(400).json({message: 'Faltan las fechas'});
            const response = await this.service.getDisponibles(String(req.query.fecha_inicio), String(req.query.fecha_fin));
            return res.status(200).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al ver disponibles'});
        }
    }

    async getAll(req: Request, res: Response){
        try {
            const response = await this.service.getAll();
            return res.status(200).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al ver los recursos'});
        }
    }

    async create(req: Request, res: Response){
        try {
            const response = await this.service.create(req.body, res.locals.usuario.id);
            return res.status(201).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al crear recurso'});
        }
    }

    async update(req: Request, res: Response){
        try {
            const response = await this.service.update(Number(req.params.id), req.body, res.locals.usuario.id);
            if(!response) return res.status(404).json({message: 'El recurso no existe'});
            return res.status(200).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al modificar recurso'});
        }
    }

    async delete(req: Request, res: Response){
        try {
            const response = await this.service.delete(Number(req.params.id), res.locals.usuario.id);
            if(!response) return res.status(404).json({message: 'El recurso no existe'});
            return res.status(200).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al borrar el recurso'});
        }
    }
}
