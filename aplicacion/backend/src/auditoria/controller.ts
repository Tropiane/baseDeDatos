import {Request, Response} from 'express';
import AuditoriaService from './service';

export default class AuditoriaController{
    private service = new AuditoriaService();

    async getAll(req: Request, res: Response){
        try {
            const response = await this.service.getAll();
            return res.status(200).json(response);
        } catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }
}
