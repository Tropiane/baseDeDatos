import {Router, Request, Response} from 'express';
import ReservaController from './controller';
import {validarUsuario} from '../middlewares/validarTokens';

const router = Router();
const controller = new ReservaController();

router.use(validarUsuario);
router.get('/all', (req: Request, res: Response) => controller.getAll(req, res));
router.post('/create', (req: Request, res: Response) => controller.create(req, res));
router.put('/update/:id', (req: Request, res: Response) => controller.update(req, res));

const reservaRouter = router;
export default reservaRouter;
