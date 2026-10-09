import { JogadoresRepository } from "./jogadores.repository.js";

const colunasOrdenaveis = ['id', 'nome', 'data_nascimento', 'posicao', 'time_id']

function validarDadosJogador(dados){
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)){
        throw { status: 400, message: 'Dados do jogador inválidos' }
    }

    const { nome, data_nascimento, posicao, time_id } = dados

    if (typeof nome !== 'string' || nome.trim() === ''){
        throw { status: 400, message: 'Nome deve ser uma string' }
    }

    if (typeof data_nascimento !== 'string' || isNaN(Date.parse(data_nascimento))){
        throw { status: 400, message: 'Data de nascimento inválida' }
    }

    if (typeof posicao !== 'string' || posicao.trim() === ''){
        throw { status: 400, message: 'Posição deve ser uma string' }
    }

    if (!Number.isInteger(Number(time_id)) || Number(time_id) <= 0){
        throw { status: 400, message: 'Id do time deve ser um inteiro positivo' }
    }
}

export class JogadoresService{
    repo = new JogadoresRepository()

    async findAllPaginado(idJogador, page = 1, limit = 10, ordenar = 'id', direcao = 'asc'){
        const pageNumber = Number(page)
        const limitNumber = Number(limit)
        const sortColumn = ordenar || 'id'
        const sortDirection = String(direcao || 'asc').toLowerCase()

        if (!Number.isInteger(pageNumber) || pageNumber < 1){
            throw { status: 400, message: 'Página deve ser um inteiro positivo' }
        }

        if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100){
            throw { status: 400, message: 'Limite deve ser um inteiro entre 1 e 100' }
        }

        let jogadorId
        if (idJogador !== undefined){
            jogadorId = Number(idJogador)
            if (!Number.isInteger(jogadorId) || jogadorId < 1){
                throw { status: 400, message: 'Id do jogador deve ser um inteiro positivo' }
            }
        }

        if (!colunasOrdenaveis.includes(sortColumn)){
            throw { status: 400, message: 'Coluna de ordenação inválida' }
        }

        if (!['asc', 'desc'].includes(sortDirection)){
            throw { status: 400, message: 'Direção deve ser asc ou desc' }
        }

        return this.repo.findAllPaginado(
            jogadorId,
            pageNumber,
            limitNumber,
            sortColumn,
            sortDirection
        )
    }

    async findAll(){
        return this.repo.findAll()
    }

    async findById(id){
        const jogadorId = Number(id)
        if (!Number.isInteger(jogadorId) || jogadorId <= 0){
            throw { status: 400, message: 'Id inválido' }
        }
        return this.repo.findById(jogadorId)
    }

    async create(dados){
        validarDadosJogador(dados)
        const { nome, data_nascimento, posicao, time_id } = dados
        return this.repo.create(nome, data_nascimento, posicao, Number(time_id))
    }

    async update(id, dados){
        const jogadorId = Number(id)
        if (!Number.isInteger(jogadorId) || jogadorId <= 0){
            throw { status: 400, message: 'Id inválido' }
        }

        const jogadorExistente = await this.repo.findById(jogadorId)
        if (!jogadorExistente){
            throw { status: 404, message: 'Jogador não existente' }
        }

        validarDadosJogador(dados)
        const dadosNormalizados = { ...dados, time_id: Number(dados.time_id) }
        return this.repo.update(jogadorId, dadosNormalizados)
    }

    async delete(id){
        const jogadorId = Number(id)
        if (!Number.isInteger(jogadorId) || jogadorId <= 0){
            throw { status: 400, message: 'Id inválido' }
        }

        const jogadorExistente = await this.repo.findById(jogadorId)
        if (!jogadorExistente){
            throw { status: 404, message: 'Jogador não existente' }
        }

        return this.repo.delete(jogadorId)
    }
}
