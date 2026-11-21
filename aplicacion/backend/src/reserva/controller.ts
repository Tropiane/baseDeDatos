import {Request, Response} from 'express';
import ReservaService from './service';
import reserva from './interface';

export default class ReservaController{
    private service = new ReservaService();

    async getAll(req: Request, res: Response){
        try {
            const response = await this.service.getAll(res.locals.usuario.id, res.locals.usuario.rol);
            return res.status(200).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }

    async create(req: Request<{}, {}, reserva>, res: Response){
        try {
            const response = await this.service.create(req.body, res.locals.usuario.id);
            if(!response) return res.status(409).json({message: 'El recurso no esta disponible en ese horario'});
            return res.status(201).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }

    async update(req: Request<{id: string}, {}, {estado: string}>, res: Response){
        try {
            const response = await this.service.update(Number(req.params.id), req.body?.estado, res.locals.usuario.id, res.locals.usuario.rol);
            if(!response) return res.status(404).json({message: 'No se encontro una reserva que puedas modificar'});
            return res.status(200).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }

    async delete(req: Request<{id: string}>, res: Response){
        try {
            //Cancelo la reserva para conservar el historial
            const response = await this.service.update(Number(req.params.id), 'cancelada', res.locals.usuario.id, res.locals.usuario.rol);
            if(!response) return res.status(404).json({message: 'No se encontro una reserva que puedas modificar'});
            return res.status(200).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }
}
