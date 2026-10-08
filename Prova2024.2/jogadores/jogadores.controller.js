import { JogadoresService } from "./jogadores.service";

export class JogadoresController{
    service = new JogadoresService();

    async findAll(_req, res){
        try{
            const jogadores = this.service.findAll()
            res.status(200).json(jogadores)
        }catch(e){
            throw { status: e.status || 500, message: e.message || 'Erro interno'}
        }
    }

    async findById(req, res){
        try{
            const { id } = req.params

            const jogador = this.service.findById(id)
            res.status(200).json(jogador)
        }catch(e){
            throw { status: e.status || 500, message: e.message || 'Erro interno'}
        }
    }

    async create(req, res){
        try{
            const dados = req.body

            const novoJogador = this.service.create(dados)
            res.status(201).json(novoJogador)
        }catch(e){
            throw { status: e.status || 500, message: e.message || 'Erro interno'}     
        }
    }

    async update(req, res){
            const dados = req.body

            const jogadorAtualizado = this.service.update(dados)
            res.status(200).json(jogadorAtualizado)
    }

    async delete(req, res){
        try{
            const { id } = req.params
            
            this.service.delete(id)

            res.status(204).send()
        }catch(e){
            throw { status: e.status || 500, message: e.message || 'Erro interno'}     
        }
    }
}