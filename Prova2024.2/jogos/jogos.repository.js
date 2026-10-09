import { db } from "../db/connection.js"

export class JogosRepository{

    async findById(id){
        const row = await db('jogos')
            .join('times as time_mandante', 'jogos.mandante', 'time_mandante.id')
            .join('times as time_visitante', 'jogos.visitante', 'time_visitante.id')
            .join('estadios', 'jogos.estadio_id', 'estadios.id')
            .select(
                'jogos.id as id',
                'time_mandante.nome as mandante',
                'time_visitante.nome as visitante',
                'estadios.nome as estadio',
                'jogos.data_hora as data_hora'
            )
            .where('jogos.id', id)
            .first()

        return row
    }

    async existeConflitoDeHorario(estadioId, dataHora){
        const jogo = await db('jogos')
            .select('id')
            .where('estadio_id', estadioId)
            .where('data_hora', dataHora)
            .first()

        return Boolean(jogo)
    }

    async create(dados){
        const [novoJogo] = await db('jogos')
            .insert(dados)
            .returning('*')

        return novoJogo
    }
}
