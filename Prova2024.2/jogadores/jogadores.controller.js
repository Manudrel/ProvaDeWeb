import { JogadoresService } from "./jogadores.service.js";

export class JogadoresController{
    service = new JogadoresService();

    async findAll(_req, res){
        try{
            const jogadores = await this.service.findAll()
            return res.status(200).json(jogadores)
        }catch(e){
            return res.status(e.status || 500).json({ message: e.message || 'Erro interno' })
        }
    }

    async findAllPaginado(req, res){
        try{
            const { idJogador, page, limit, ordenar, direcao } = req.query
            const jogadores = await this.service.findAllPaginado(
                idJogador,
                page,
                limit,
                ordenar,
                direcao
            )
            return res.status(200).json(jogadores)
        }catch(e){
            return res.status(e.status || 500).json({ message: e.message || 'Erro interno' })
        }
    }

    async findById(req, res){
        try{
            const { id } = req.params

            const jogador = await this.service.findById(id)
            return res.status(200).json(jogador)
        }catch(e){
            return res.status(e.status || 500).json({ message: e.message || 'Erro interno' })
        }
    }

    async create(req, res){
        try{
            const dados = req.body

            const novoJogador = await this.service.create(dados)
            return res.status(201).json(novoJogador)
        }catch(e){
            return res.status(e.status || 500).json({ message: e.message || 'Erro interno' })
        }
    }

    async update(req, res){
        try{
            const jogadorAtualizado = await this.service.update(req.params.id, req.body)
            return res.status(200).json(jogadorAtualizado)
        }catch(e){
            return res.status(e.status || 500).json({ message: e.message || 'Erro interno' })
        }
    }

    async delete(req, res){
        try{
            const { id } = req.params
            
            await this.service.delete(id)
            return res.status(204).send()
        }catch(e){
            return res.status(e.status || 500).json({ message: e.message || 'Erro interno' })
        }
    }
}
