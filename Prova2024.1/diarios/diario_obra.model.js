export class DiarioObra {
    constructor({ id, obra_id, data, observacoes = null, usuario_id, materiais = [], itens = [] }) {
        this.id = id
        this.obra_id = obra_id
        this.data = data
        this.observacoes = observacoes
        this.usuario_id = usuario_id
        this.materiais = materiais
        this.itens = itens
    }

    getId() {
        return this.id
    }

    setId(id) {
        this.id = id
    }
}
