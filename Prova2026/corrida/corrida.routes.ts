import { CorridaController } from './corrida.controller';
import { Request, Response } from 'express';
import { Router } from 'express';

export function createCorridaRouter(): Router {
    const router = Router();
    const controller = new CorridaController();

    router.get('/', (req: Request, res: Response) => controller.findAll(req, res));
    router.get('/:id', (req: Request, res: Response) => controller.buscarCorridaPorId(req, res));
    router.post('/', (req: Request, res: Response) => controller.criarCorrida(req, res));
    router.put('/:id', (req: Request, res: Response) => controller.atualizarCorrida(req, res));
    router.delete('/:id', (req: Request, res: Response) => controller.deletarCorrida(req, res));

    return router;
}