import { DiariosService } from './diarios.service.js'

export class DiariosController {
    service = new DiariosService()

    async findAll(_req, res) {
        try {
            const diarios = await this.service.findAll()
            return res.status(200).json(diarios)
        } catch (e) {
            return res.status(e.status || 500).json({
                message: e.message || 'Erro interno'
            })
        }
    }

    async findById(req, res) {
        try {
            const diario = await this.service.findById(req.params.id)
            return res.status(200).json(diario)
        } catch (e) {
            return res.status(e.status || 500).json({
                message: e.message || 'Erro interno'
            })
        }
    }

    async create(req, res) {
        try {
            const diario = await this.service.create(req.body)
            return res.status(201).json(diario)
        } catch (e) {
            return res.status(e.status || 500).json({
                message: e.message || 'Erro interno'
            })
        }
    }

    async update(req, res) {
        try {
            const diario = await this.service.update(req.params.id, req.body)
            return res.status(200).json(diario)
        } catch (e) {
            return res.status(e.status || 500).json({
                message: e.message || 'Erro interno'
            })
        }
    }

    async patch(req, res) {
        try {
            const diario = await this.service.patch(req.params.id, req.body)
            return res.status(200).json(diario)
        } catch (e) {
            return res.status(e.status || 500).json({
                message: e.message || 'Erro interno'
            })
        }
    }

    async delete(req, res) {
        try {
            await this.service.delete(req.params.id)
            return res.status(204).send()
        } catch (e) {
            return res.status(e.status || 500).json({
                message: e.message || 'Erro interno'
            })
        }
    }
}
