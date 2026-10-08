import { db } from "../db/connection"

export class JogadoresRepository{
    
    async findAllPaginado(idJogador = undefined, page = 1, limit = 10, ordenar, direcao = 'desc'){
        const offset = (page-1)*limit

        let query = db('jogadores')
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy(ordenar, direcao)
        
        if (idJogador !== undefined){
            query = query.where('jogares.id', idJogador)
        }
        
        return await query
    }

    async findAll(){
        const rows = await db('jogadores')
            .select(
                'jogadores.id as id',
                'jogadores.nome as nome',
                'jogadores.data_nascimento as dataNascimento',
                'jogadores.posicao as posicao',
                'time_id as timeId'
            )
            .orderBy('jogadores.id', 'asc')
        
        return rows.map(row =>({
            id: row.id,
            nome: row.nome,
            data_nascimento: row.dataNascimento,
            posicao: row.posicao,
            time_id: row.timeId
        }))
    }

    async findById(id){
        const row = await db('jogadores')
            .select(
                'jogadores.id as id',
                'jogadores.nome as nome',
                'jogadores.data_nascimento as dataNascimento',
                'jogadores.posicao as posicao',
                'time_id as timeId'
            )
            .where('jogadores.id', id)
            .first()
        
        if (!row){
            return undefined
        }
        return {
            id: row.id,
            nome: row.nome,
            data_nascimento: row.dataNascimento,
            posicao: row.posicao,
            time_id: row.timeId
        }
    }

    async create(nome, data_nascimento, posicao, time_id){
        const [novoJogador] = await db('jogadores')
            .insert({
                nome: nome,
                data_nascimento: data_nascimento,
                posicao: posicao,
                time_id: time_id
            })
            .returning(['id','nome', 'data_nascimento', 'posicao', 'time_id'])

            return novoJogador
    }

    async update(id, dados){
        const { nome, data_nascimento, posicao, time_id} = dados

        const [jogadorAtualizado] = await db('jogadores')
            .where('id', id)
            .update({
                nome, 
                data_nascimento, 
                posicao, 
                time_id
            })
            .returning(['id','nome', 'data_nascimento', 'posicao', 'time_id'])

        return jogadorAtualizado
    }

    async delete(id){
        const result = await db('jogadores')
            .where('id', id)
            .del()
        
        return result > 0
    }
}