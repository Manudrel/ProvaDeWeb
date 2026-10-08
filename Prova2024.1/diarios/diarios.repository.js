import { db } from '../db/connection.js'
import { DiarioObra } from './diario_obra.model.js'

function criarDiario(row, materiais = [], itens = []) {
    return new DiarioObra({
        id: row.id,
        obra_id: row.obra_id,
        data: row.data,
        observacoes: row.observacoes,
        usuario_id: row.usuario_id,
        materiais,
        itens
    })
}

export class DiariosRepository {
    async findAll() {
        const diarios = await db('diario_obra as diario')
            .select(
                'diario.id as id',
                'diario.obra_id as obra_id',
                'diario.data as data',
                'diario.observacoes as observacoes',
                'diario.usuario_id as usuario_id'
            )
            .orderBy('diario.data', 'desc')
            .orderBy('diario.id', 'desc')

        if (diarios.length === 0) {
            return []
        }

        const ids = diarios.map(diario => diario.id)
        const [materiais, itens] = await Promise.all([
            db('material_diario as material_diario')
                .join('material', 'material_diario.material_id', 'material.id')
                .whereIn('material_diario.diario_obra_id', ids)
                .select(
                    'material_diario.diario_obra_id as diario_id',
                    'material.id as id',
                    'material.nome as nome',
                    'material.unidade_medida as unidade_medida',
                    'material_diario.quantidade as quantidade'
                )
                .orderBy('material_diario.id', 'asc'),
            db('item_diario as item_diario')
                .join('item', 'item_diario.item_construido_id', 'item.id')
                .whereIn('item_diario.diario_obra_id', ids)
                .select(
                    'item_diario.diario_obra_id as diario_id',
                    'item.id as id',
                    'item.nome as nome',
                    'item_diario.quantidade as quantidade'
                )
                .orderBy('item_diario.id', 'asc')
        ])

        const materiaisPorDiario = new Map(ids.map(id => [id, []]))
        const itensPorDiario = new Map(ids.map(id => [id, []]))

        for (const material of materiais) {
            const { diario_id, ...dados } = material
            materiaisPorDiario.get(diario_id)?.push(dados)
        }

        for (const item of itens) {
            const { diario_id, ...dados } = item
            itensPorDiario.get(diario_id)?.push(dados)
        }

        return diarios.map(diario => criarDiario(
            diario,
            materiaisPorDiario.get(diario.id),
            itensPorDiario.get(diario.id)
        ))
    }

    async findById(id) {
        const diario = await db('diario_obra')
            .select('id', 'obra_id', 'data', 'observacoes', 'usuario_id')
            .where('id', id)
            .first()

        if (!diario) {
            return undefined
        }

        const [materiais, itens] = await Promise.all([
            db('material_diario as material_diario')
                .join('material', 'material_diario.material_id', 'material.id')
                .where('material_diario.diario_obra_id', id)
                .select(
                    'material.id as id',
                    'material.nome as nome',
                    'material.unidade_medida as unidade_medida',
                    'material_diario.quantidade as quantidade'
                )
                .orderBy('material_diario.id', 'asc'),
            db('item_diario as item_diario')
                .join('item', 'item_diario.item_construido_id', 'item.id')
                .where('item_diario.diario_obra_id', id)
                .select(
                    'item.id as id',
                    'item.nome as nome',
                    'item_diario.quantidade as quantidade'
                )
                .orderBy('item_diario.id', 'asc')
        ])

        return criarDiario(diario, materiais, itens)
    }

    async create(dados) {
        const id = await db.transaction(async trx => {
            const [diario] = await trx('diario_obra')
                .insert({
                    obra_id: dados.obra_id,
                    data: dados.data,
                    observacoes: dados.observacoes ?? null,
                    usuario_id: dados.usuario_id
                })
                .returning(['id'])

            await this.inserirMateriais(trx, diario.id, dados.materiais)
            await this.inserirItens(trx, diario.id, dados.itens)

            return diario.id
        })

        return this.findById(id)
    }

    async update(id, dados) {
        await db.transaction(async trx => {
            const campos = {}
            for (const campo of ['obra_id', 'data', 'observacoes', 'usuario_id']) {
                if (Object.hasOwn(dados, campo)) {
                    campos[campo] = dados[campo]
                }
            }

            if (Object.keys(campos).length > 0) {
                await trx('diario_obra').where('id', id).update(campos)
            }

            if (Object.hasOwn(dados, 'materiais')) {
                await trx('material_diario').where('diario_obra_id', id).del()
                await this.inserirMateriais(trx, id, dados.materiais)
            }

            if (Object.hasOwn(dados, 'itens')) {
                await trx('item_diario').where('diario_obra_id', id).del()
                await this.inserirItens(trx, id, dados.itens)
            }
        })

        return this.findById(id)
    }

    async delete(id) {
        return db.transaction(async trx => {
            const diario = await trx('diario_obra').select('id').where('id', id).first()
            if (!diario) {
                return false
            }

            await trx('material_diario').where('diario_obra_id', id).del()
            await trx('item_diario').where('diario_obra_id', id).del()

            const removidos = await trx('diario_obra').where('id', id).del()
            return removidos > 0
        })
    }

    async inserirMateriais(trx, diarioId, materiais) {
        if (materiais.length === 0) {
            return
        }

        await trx('material_diario').insert(materiais.map(material => ({
            diario_obra_id: diarioId,
            material_id: material.material_id,
            quantidade: material.quantidade
        })))
    }

    async inserirItens(trx, diarioId, itens) {
        if (itens.length === 0) {
            return
        }

        await trx('item_diario').insert(itens.map(item => ({
            diario_obra_id: diarioId,
            item_construido_id: item.item_construido_id,
            quantidade: item.quantidade
        })))
    }
}
