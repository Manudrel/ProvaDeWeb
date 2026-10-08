import { CorridaRepository } from './corrida.repository';
import { Corrida, NovaCorrida } from './corrida.schema';
import { MotoristaRepository } from '../motorista/motorista.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';

export class CorridaService {
    private repo = new CorridaRepository();
    private motoristaRepo = new MotoristaRepository();
    private usuarioRepo = new UsuarioRepository();

    async findAll(
        passageiro_id?: number,
        limit: number = 10,
        page: number = 1,
        ordenar: string = 'id',
        direcao: 'asc' | 'desc' = 'desc'
    ) {
        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
            throw { status: 400, message: 'Limit deve ser um inteiro entre 1 e 100' };
        }

        if (!Number.isSafeInteger(page) || page < 1) {
            throw { status: 400, message: 'Página deve ser um inteiro maior que 0' };
        }

        if (passageiro_id !== undefined &&
            (!Number.isSafeInteger(passageiro_id) || passageiro_id < 1)) {
            throw { status: 400, message: 'passageiro_id inválido' };
        }

        const camposOrdenacao = ['id', 'created_at', 'valor'];
        if (!camposOrdenacao.includes(ordenar)) {
            throw { status: 400, message: 'Campo de ordenação inválido' };
        }

        if (direcao !== 'asc' && direcao !== 'desc') {
            throw { status: 400, message: 'Direção inválida' };
        }

        return this.repo.findAll(passageiro_id, limit, page, ordenar, direcao);
    }

    async buscarCorridaPorId(id: number): Promise<Corrida | undefined> {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw { status: 400, message: 'ID inválido' };
        }

        return this.repo.findById(id);
    }

    private async validarDadosCorrida(corrida: NovaCorrida): Promise<void> {
        if (!corrida || typeof corrida !== 'object' || Array.isArray(corrida)) {
            throw { status: 400, message: 'Corpo da corrida inválido' };
        }

        const camposPermitidos: Array<keyof NovaCorrida> = [
            'passageiro_id',
            'motorista_id',
            'latitude',
            'longitude',
            'valor'
        ];
        const camposRecebidos = Object.keys(corrida);
        const temCamposFaltando = camposPermitidos.some(
            campo => !Object.prototype.hasOwnProperty.call(corrida, campo)
        );
        const temCamposExtras = camposRecebidos.some(
            campo => !camposPermitidos.includes(campo as keyof NovaCorrida)
        );

        if (temCamposFaltando || temCamposExtras) {
            throw { status: 400, message: 'Envie somente os campos necessários da corrida' };
        }

        if (!Number.isSafeInteger(corrida.passageiro_id) || corrida.passageiro_id <= 0 ||
            !Number.isSafeInteger(corrida.motorista_id) || corrida.motorista_id <= 0) {
            throw { status: 400, message: 'IDs de passageiro e motorista devem ser inteiros positivos' };
        }

        if (typeof corrida.latitude !== 'number' || !Number.isFinite(corrida.latitude) ||
            corrida.latitude < -90 || corrida.latitude > 90 ||
            typeof corrida.longitude !== 'number' || !Number.isFinite(corrida.longitude) ||
            corrida.longitude < -180 || corrida.longitude > 180) {
            throw { status: 400, message: 'Coordenadas inválidas' };
        }

        if (typeof corrida.valor !== 'number' || !Number.isFinite(corrida.valor) || corrida.valor <= 0) {
            throw { status: 400, message: 'O valor deve ser um número maior que 0' };
        }

        const [passageiroExiste, statusMotorista] = await Promise.all([
            this.usuarioRepo.existe(corrida.passageiro_id),
            this.motoristaRepo.buscarStatus(corrida.motorista_id)
        ]);

        if (!passageiroExiste) {
            throw { status: 404, message: 'Passageiro não encontrado' };
        }

        if (statusMotorista === undefined) {
            throw { status: 404, message: 'Motorista não encontrado' };
        }

        if (statusMotorista !== 'ativo') {
            throw { status: 409, message: 'O motorista não está ativo' };
        }
    }

    async criarCorrida(corrida: NovaCorrida): Promise<Corrida> {
        await this.validarDadosCorrida(corrida);
        return this.repo.create(corrida);
    }

    async atualizarCorrida(id: number, corrida: NovaCorrida): Promise<Corrida | undefined> {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw { status: 400, message: 'ID inválido' };
        }

        await this.validarDadosCorrida(corrida);
        return this.repo.update(id, corrida);
    }

    async deletarCorrida(id: number): Promise<boolean> {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw { status: 400, message: 'ID inválido' };
        }

        const corrida = await this.repo.findById(id);
        if (!corrida) {
            throw { status: 404, message: 'Corrida não encontrada' };
        }

        return this.repo.delete(id);
    }
}
