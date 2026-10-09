import { JogosService } from "./jogos.service.js";

export class JogosController{
    service = new JogosService()

    async findById(req, res){
        try{
            const { id } = req.params
            const jogo = await this.service.findById(id)

            return res.status(200).json(jogo)
        }catch(e){
            return res.status(e.status || 500).json({
                message: e.message || 'Erro interno'
            })
        }
    }

    async create(req, res){
        try{
            const novoJogo = await this.service.create(req.body)

            return res.status(201).json(novoJogo)
        }catch(e){
            return res.status(e.status || 500).json({
                message: e.message || 'Erro interno'
            })
        }
    }
}
