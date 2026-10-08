import { JogosRepository } from "./jogos.repository";

export class JogosService{
    repo = new JogosRepository()

    async findById(id){
        if(!Number.isInteger(Number(id)) || Number(id)<=0){
            throw { status: 400, message: 'Id inválido' }
        }

        const jogo = await this.repo.findById(Number(id))

        if(!jogo){
            throw { status: 404, message: 'Jogo não existente' }
        }

        return jogo
    }

    async create(dados){
        if(!dados || typeof dados !== 'object' || Array.isArray(dados)){
            throw { status: 400, message: 'Dados do jogo inválidos' }
        }

        const { data_hora, estadio_id } = dados

        if(!data_hora || typeof data_hora !== 'string' || isNaN(Date.parse(data_hora))){
            throw { status: 400, message: 'Data e hora do jogo inválidas' }
        }

        if(!estadio_id || !Number.isInteger(Number(estadio_id)) || Number(estadio_id)<=0){
            throw { status: 400, message: 'Id do estádio deve ser um inteiro positivo' }
        }

        const conflito = await this.repo.existeConflitoDeHorario(Number(estadio_id), data_hora)

        if(conflito){
            throw { status: 409, message: 'Já existe um jogo neste estádio na mesma data e hora' }
        }

        return this.repo.create({
            ...dados,
            estadio_id: Number(estadio_id)
        })
    }
}
