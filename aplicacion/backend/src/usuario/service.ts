import UserDao from './dao';
import {hashPassword, comparePassword} from '../utils/hash';
import {signToken} from '../utils/jwt';
import {user} from './interface';

export default class UserService{
    private dao = new UserDao();

    async getAll(){
        return await this.dao.getAll();
    }

    async findEmail(correo: string){
        return await this.dao.findEmail(correo);
    }

    async create(data: user){
        if(!data?.nombre || !data.edad || !data.correo || typeof data.contrasena !== 'string' || !data.contrasena){
            throw new Error('Faltan datos');
        }
        data.contrasena = hashPassword(data.contrasena);
        return await this.dao.create(data);
    }

    async delete(id: number, id_usuario: number){
        return await this.dao.delete(id, id_usuario);
    }

    async login(correo: string, contrasena: string){
        const [usuario] = await this.findEmail(correo);
        if(!usuario?.estado || typeof contrasena !== 'string' || !usuario.contrasena || !comparePassword(contrasena, usuario.contrasena)){
            return null;
        }
        return signToken({id: usuario.id});
    }
}
