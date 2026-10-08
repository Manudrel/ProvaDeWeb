import { Router } from 'express'
import { JogadoresController } from './jogadores.controller'

export function createJogadoresRoutes(){
    const router = Router()
    const controller = new JogadoresController()

    router.get('/', (req, res) => controller.findAll(req, res))
    router.get('/:id', (req, res)=> controller.findById(req, res))
    router.post('/', (req, res)=> controller.create(req, res))
    router.put('/:id', (req, res)=> controller.update(req, res))
    router.delete('/:id', (req, res)=> controller.delete(req, res))

    return router
}