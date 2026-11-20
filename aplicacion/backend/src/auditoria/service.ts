import AuditoriaDao from './dao';

export default class AuditoriaService{
    private dao = new AuditoriaDao();

    async getAll(){
        return await this.dao.getAll();
    }
}
