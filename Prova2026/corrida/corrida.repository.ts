import { db } from '../db/connection'
import { Corrida, NovaCorrida } from './corrida.schema';

export class CorridaRepository{

    async findAll(passageiro_id?: number,limit: number = 10,page: number = 1,ordenar: string = 'id',direcao: 'asc' | 'desc' = 'desc') {
    const offset = (page - 1) * limit

    let query = db('corridas')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy(ordenar, direcao)

    if (passageiro_id) {
      query = query.where('passageiro_id', passageiro_id)
    }

    return await query
  }

    async findById(id: number): Promise<Corrida | undefined>{
        const row = await db('corridas as c')
            .join('usuarios as u', 'passageiro_id', 'u.id')
            .select(
                'c.id as corrida_id',
                'c.passageiro_id',
                'c.motorista_id',
                'c.latitude',
                'c.longitude',
                'c.valor',
                'c.created_at'
            )
            .where('c.id', id)
            .first();

        if(!row) return undefined;

        return {
            id: row.corrida_id,
            passageiro_id: row.passageiro_id,
            motorista_id: row.motorista_id,
            latitude: row.latitude,
            longitude: row.longitude,
            valor: row.valor,
            created_at: row.created_at
        };
    }

    async create(corrida: NovaCorrida): Promise<Corrida>{
        const [novaCorrida] = await db('corridas')
            .insert({
                passageiro_id: corrida.passageiro_id,
                motorista_id: corrida.motorista_id,
                latitude: corrida.latitude,
                longitude: corrida.longitude,
                valor: corrida.valor
            })
            .returning(['id', 'passageiro_id', 'motorista_id', 'latitude', 'longitude', 'valor', 'created_at']);
        
        return novaCorrida;
    }

    async update(id: number, corrida: NovaCorrida): Promise<Corrida | undefined>{
        const [corridaAtualizada] = await db('corridas')
            .where('id', id)
            .update({
                passageiro_id: corrida.passageiro_id,
                motorista_id: corrida.motorista_id,
                latitude: corrida.latitude,
                longitude: corrida.longitude,
                valor: corrida.valor
            })
            .returning(['id', 'passageiro_id', 'motorista_id', 'latitude', 'longitude', 'valor', 'created_at']);
        
        return corridaAtualizada;
    }

    async delete(id: number): Promise<boolean>{
        const result = await db('corridas')
            .where('id', id)
            .del();

        return result > 0;
    }
}
