import { JogadoresRepository } from "./jogadores.repository";

export class JogadoresService{
    repo = new JogadoresRepository()

    async findlAllPaginado(idJogador = undefined, page, limit, ordenar, direcao){
        
        if(idJogador !== undefined){
            if(isNaN(id) || Number(id)<=0){
                throw { status: 400, message: 'Id Inválido'}
            }
        }
        
        if(page){
            if(Number(page)<=0 || isNaN(page)){
                throw { status: 400, message: 'Página inválida'}
            }
        }
        
        if(limit){
            if(Number(limit)<=0 || isNaN(limit)){
                throw { status: 400, message: 'Limite inválido'}
            }
        }

        return this.repo.findAllPaginado(idJogador, page, limit, ordenar, direcao)
    }

    async findAll(){
        return this.repo.findAll()
    }

    async findById(id){
        if(isNaN(id) || Number(id)<=0){
            throw { status: 400, message: 'Id Inválido'}
        }
        return this.repo.findById(Number(id));
    }

    async create(dados){
        const { nome, data_nascimento, posicao, time_id} = dados

        if(!nome || nome.trim()==='' || typeof nome !== 'string'){
            throw { status: 400, message: 'Nome deve ser uma string'}
        }

        if(!data_nascimento || typeof data_nascimento !== 'string' || isNaN(Date.parse(data_nascimento))){
            throw { status: 400, message: 'Data de nascimento inválida' }
        }
        
        if(!posicao || posicao.trim()==='' || typeof posicao !== 'string'){
            throw { status: 400, message: 'Posição deve ser uma string'}
        }

        if(!time_id || Number(time_id)<=0 || isNaN(time_id)){
            throw { status: 400, message: 'Id do time deve ser um inteiro não nulo positivo'}
        }

        return this.repo.create(nome, data_nascimento, posicao, time_id)
    }

    async update(id, dados){
        if(isNaN(id) || Number(id)<=0){
            throw { status: 400, message: 'Id Inválido'}
        }
        
        const jogadorExistente = this.repo.findById(id)
        
        if(!jogadorExistente){
            throw{status: 404, message: 'Jogador não existente'}
        }

        const { nome, data_nascimento, posicao, time_id} = dados

        if(!nome || nome.trim()==='' || typeof nome !== 'string'){
            throw { status: 400, message: 'Nome deve ser uma string'}
        }

        if(!data_nascimento || typeof data_nascimento !== 'string' || isNaN(Date.parse(data_nascimento))){
            throw { status: 400, message: 'Data de nascimento inválida' }
        }
        
        if(!posicao || posicao.trim()==='' || typeof posicao !== 'string'){
            throw { status: 400, message: 'Posição deve ser uma string'}
        }

        if(!time_id || Number(time_id)<=0 || isNaN(time_id)){
            throw { status: 400, message: 'Id do time deve ser um inteiro não nulo positivo'}
        }

        return this.repo.update(id, dados)
    }

    async delete(id){
        if(isNaN(id) || Number(id)<=0){
            throw { status: 400, message: 'Id Inválido'}
        }
        
        const jogadorExistente = this.repo.findById(id)
        
        if(!jogadorExistente){
            throw{status: 404, message: 'Jogador não existente'}
        }

        return this.repo.delete(id)
    }
}