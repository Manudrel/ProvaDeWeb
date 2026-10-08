import { Router } from 'express'
import { JogosController } from './jogos.controller'

export function createJogosRoutes(){
    const router = Router()
    const controller = new JogosController()

    router.get('/:id', (req, res) => controller.findById(req, res))
    router.post('/', (req, res) => controller.create(req, res))

    return router
}
