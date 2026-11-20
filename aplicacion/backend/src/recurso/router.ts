import {Router, Request, Response} from 'express';
import RecursoController from './controller';
import {validarUsuario, validarAdmin, validarEditor} from '../middlewares/validarTokens';

const router = Router();
const controller = new RecursoController();

router.use(validarUsuario);
router.get('/disponibles', (req: Request, res: Response) => controller.getDisponibles(req, res));
router.get('/all', (req: Request, res: Response) => controller.getAll(req, res));
router.post('/create', validarAdmin, (req: Request, res: Response) => controller.create(req, res));
router.put('/update/:id', validarEditor, (req: Request, res: Response) => controller.update(req, res));
router.delete('/delete/:id', validarAdmin, (req: Request, res: Response) => controller.delete(req, res));

const recursoRouter = router;
export default recursoRouter;
