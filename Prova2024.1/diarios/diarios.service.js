import { DiariosRepository } from './diarios.repository.js'

const CAMPOS_DIARIO = ['obra_id', 'data', 'observacoes', 'usuario_id', 'materiais', 'itens']

function validarObjeto(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw { status: 400, message: 'Dados do diário inválidos' }
    }

    const camposDesconhecidos = Object.keys(dados).filter(campo => !CAMPOS_DIARIO.includes(campo))
    if (camposDesconhecidos.length > 0) {
        throw { status: 400, message: `Campos não permitidos: ${camposDesconhecidos.join(', ')}` }
    }
}

function validarId(id, nomeCampo) {
    const valor = Number(id)
    if (!Number.isInteger(valor) || valor <= 0) {
        throw { status: 400, message: `${nomeCampo} deve ser um inteiro positivo` }
    }
    return valor
}

function validarData(data) {
    if (typeof data !== 'string' || data.trim() === '' || Number.isNaN(Date.parse(data))) {
        throw { status: 400, message: 'Data do diário inválida' }
    }
    return data
}

function validarObservacoes(observacoes) {
    if (observacoes !== null && typeof observacoes !== 'string') {
        throw { status: 400, message: 'Observações devem ser uma string ou nulas' }
    }
    return observacoes
}

function validarMateriais(materiais) {
    if (!Array.isArray(materiais)) {
        throw { status: 400, message: 'materiais deve ser um array' }
    }

    return materiais.map((material, indice) => {
        if (!material || typeof material !== 'object' || Array.isArray(material)) {
            throw { status: 400, message: `Material na posição ${indice} inválido` }
        }

        return {
            material_id: validarId(material.material_id, `material_id na posição ${indice}`),
            quantidade: validarQuantidade(material.quantidade, `quantidade do material na posição ${indice}`)
        }
    })
}

function validarItens(itens) {
    if (!Array.isArray(itens)) {
        throw { status: 400, message: 'itens deve ser um array' }
    }

    return itens.map((item, indice) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
            throw { status: 400, message: `Item na posição ${indice} inválido` }
        }

        return {
            item_construido_id: validarId(item.item_construido_id, `item_construido_id na posição ${indice}`),
            quantidade: validarQuantidade(item.quantidade, `quantidade do item na posição ${indice}`)
        }
    })
}

function validarQuantidade(quantidade, campo) {
    const valor = Number(quantidade)
    if (!Number.isFinite(valor) || valor <= 0) {
        throw { status: 400, message: `${campo} deve ser maior que zero` }
    }
    return valor
}

function validarCamposBase(dados, parcial = false) {
    const normalizado = {}

    for (const campo of ['obra_id', 'usuario_id']) {
        if (!parcial || Object.hasOwn(dados, campo)) {
            normalizado[campo] = validarId(dados[campo], campo)
        }
    }

    if (!parcial || Object.hasOwn(dados, 'data')) {
        normalizado.data = validarData(dados.data)
    }

    if (Object.hasOwn(dados, 'observacoes')) {
        normalizado.observacoes = validarObservacoes(dados.observacoes)
    } else if (!parcial) {
        normalizado.observacoes = null
    }

    return normalizado
}

export class DiariosService {
    repo = new DiariosRepository()

    async findAll() {
        return this.repo.findAll()
    }

    async findById(id) {
        const diarioId = validarId(id, 'Id')
        const diario = await this.repo.findById(diarioId)

        if (!diario) {
            throw { status: 404, message: 'Diário de obra não existente' }
        }

        return diario
    }

    async create(dados) {
        validarObjeto(dados)

        for (const campo of ['obra_id', 'data', 'usuario_id', 'materiais', 'itens']) {
            if (!Object.hasOwn(dados, campo)) {
                throw { status: 400, message: `O campo ${campo} é obrigatório` }
            }
        }

        return this.repo.create({
            ...validarCamposBase(dados),
            materiais: validarMateriais(dados.materiais),
            itens: validarItens(dados.itens)
        })
    }

    async update(id, dados) {
        const diarioId = validarId(id, 'Id')
        validarObjeto(dados)

        if (!Object.hasOwn(dados, 'materiais') || !Object.hasOwn(dados, 'itens')) {
            throw { status: 400, message: 'PUT deve informar os arrays materiais e itens' }
        }

        for (const campo of ['obra_id', 'data', 'usuario_id']) {
            if (!Object.hasOwn(dados, campo)) {
                throw { status: 400, message: `O campo ${campo} é obrigatório no PUT` }
            }
        }

        await this.findById(diarioId)

        const atualizado = await this.repo.update(diarioId, {
            ...validarCamposBase(dados),
            materiais: validarMateriais(dados.materiais),
            itens: validarItens(dados.itens)
        })

        if (!atualizado) {
            throw { status: 404, message: 'Diário de obra não existente' }
        }

        return atualizado
    }

    async patch(id, dados) {
        const diarioId = validarId(id, 'Id')
        validarObjeto(dados)

        if (Object.keys(dados).length === 0) {
            throw { status: 400, message: 'Informe pelo menos um campo para atualizar' }
        }

        await this.findById(diarioId)
        const atualizado = validarCamposBase(dados, true)

        if (Object.hasOwn(dados, 'materiais')) {
            atualizado.materiais = validarMateriais(dados.materiais)
        }
        if (Object.hasOwn(dados, 'itens')) {
            atualizado.itens = validarItens(dados.itens)
        }

        const resultado = await this.repo.update(diarioId, atualizado)
        if (!resultado) {
            throw { status: 404, message: 'Diário de obra não existente' }
        }

        return resultado
    }

    async delete(id) {
        const diarioId = validarId(id, 'Id')
        await this.findById(diarioId)
        return this.repo.delete(diarioId)
    }
}
