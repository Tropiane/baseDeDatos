import {Router, Request, Response} from 'express';
import AuditoriaController from './controller';
import {validarUsuario, validarAdmin} from '../middlewares/validarTokens';

const router = Router();
const controller = new AuditoriaController();

router.use(validarUsuario);
router.get('/all', validarAdmin, (req: Request, res: Response) => controller.getAll(req, res));

const auditoriaRouter = router;
export default auditoriaRouter;
