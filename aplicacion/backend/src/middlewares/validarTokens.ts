import {Request, Response, NextFunction} from 'express';
import {verifyToken} from '../utils/jwt';
import pool from '../databases/postgres';

export async function validarUsuario(req: Request, res: Response, next: NextFunction){
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.slice(7);
        }
        const payload = verifyToken(token);
        if(typeof payload === 'string' || !Number.isInteger(payload.id)){
            return res.status(401).json({message: 'Sesion invalida'});
        }

        //Aca consulto el rol actual por si cambio despues del login
        const response = await pool.query('select id, rol from usuario where id = $1 and estado = true', [payload.id]);
        if(!response.rows[0]) return res.status(401).json({message: 'Usuario inactivo o inexistente'});
        res.locals.usuario = response.rows[0];
    } catch(error){
        if(error instanceof Error && ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)){
            return res.status(401).json({message: 'Tenes que iniciar sesion'});
        }
        return res.status(500).json({message: 'Error al validar el usuario'});
    }
    next();
}

export function validarAdmin(req: Request, res: Response, next: NextFunction){
    if(res.locals.usuario.rol !== 'Administrador') return res.status(403).json({message: 'Solo el administrador puede realizar esta accion'});
    next();
}

export function validarEditor(req: Request, res: Response, next: NextFunction){
    const rol = res.locals.usuario.rol;
    if(rol !== 'Administrador' && rol !== 'Editor') return res.status(403).json({message: 'No tenes permiso para editar'});
    next();
}
