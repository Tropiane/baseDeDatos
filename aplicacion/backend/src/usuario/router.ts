import {Router, Request, Response} from 'express';
import UserController from './controller';
import { user } from './interface';
import {validarUsuario, validarAdmin} from '../middlewares/validarTokens';

const router = Router();
const controller = new UserController();

router.get('/all', validarUsuario, validarAdmin, (req: Request, res: Response) => controller.getAll(req, res));
router.post('/create', (req: Request<{},{}, user>, res: Response) => controller.create(req, res));
router.delete('/delete/:id', validarUsuario, validarAdmin, (req: Request<{id: string}>, res: Response) => controller.delete(req, res));
router.post('/login', (req: Request, res: Response) => controller.login(req, res));

router.get('/sesion', validarUsuario, (req: Request, res: Response) => res.json(res.locals.usuario));
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({message: 'Sesion cerrada'});
});

const userRouter = router;
export default userRouter;