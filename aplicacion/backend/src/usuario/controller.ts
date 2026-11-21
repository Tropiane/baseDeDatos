import {Request, Response} from "express";
import UserService from "./service";
import {user, UsuarioEditable} from "./interface";

export default class UserController {
    private userService = new UserService();

    async getAll(req: Request, res: Response) {
        try {
            const user = await this.userService.getAll();
            return res.json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }

    async create(req: Request<{},{}, user>, res: Response) {
        try {
            const user = await this.userService.create(req.body);
            return res.status(201).json({message: 'Usuario creado', user});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }

    async update(req: Request<{id: string}, {}, UsuarioEditable>, res: Response) {
        try {
            const user = await this.userService.update(Number(req.params.id), req.body, res.locals.usuario.id);
            if(!user.length) return res.status(404).json({message: 'El usuario no existe'});
            return res.status(200).json({message: 'Usuario actualizado', user});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }

    async delete(req: Request<{id: string}>, res: Response) {
        try {
            const user = await this.userService.delete(Number(req.params.id), res.locals.usuario.id);
            if(!user.length) return res.status(404).json({message: 'El usuario no existe o ya esta inactivo'});
            return res.status(200).json({message: 'Usuario desactivado', user});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }

    async login(req: Request, res: Response) {
        try {
            const token = await this.userService.login(req.body?.correo, req.body?.contrasena);
            if(!token){
                return res.status(401).json({message: 'Correo o contrasena incorrectos'});
            }
            return res.status(200).json({message: 'Sesion iniciada', token});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Error al procesar la solicitud'});
        }
    }
}
