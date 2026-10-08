import { Router } from 'express'
import { DiariosController } from './diarios.controller.js'

export function createDiariosRoutes() {
    const router = Router()
    const controller = new DiariosController()

    router.get('/', (req, res) => controller.findAll(req, res))
    router.get('/:id', (req, res) => controller.findById(req, res))
    router.post('/', (req, res) => controller.create(req, res))
    router.put('/:id', (req, res) => controller.update(req, res))
    router.patch('/:id', (req, res) => controller.patch(req, res))
    router.delete('/:id', (req, res) => controller.delete(req, res))

    return router
}
