import { Request, Response } from 'express';
import { CorridaService } from './corrida.service';

export class CorridaController {
    private service = new CorridaService();

    private parsePositiveInteger(value: unknown): number | undefined {
        if (typeof value !== 'string' || !/^[1-9][0-9]*$/.test(value)) {
            return undefined;
        }

        const parsed = Number(value);
        return Number.isSafeInteger(parsed) ? parsed : undefined;
    }

    private validarCorpoCorrida(body: unknown): string | undefined {
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return 'O corpo da requisição deve ser um objeto JSON';
        }

        const dados = body as Record<string, unknown>;
        const camposObrigatorios = [
            'passageiro_id',
            'motorista_id',
            'latitude',
            'longitude',
            'valor'
        ];
        const camposNaoPermitidos = Object.keys(dados).some(
            campo => !camposObrigatorios.includes(campo)
        );
        const campoAusente = camposObrigatorios.some(
            campo => !Object.prototype.hasOwnProperty.call(dados, campo)
        );

        if (camposNaoPermitidos || campoAusente) {
            return 'Envie somente passageiro_id, motorista_id, latitude, longitude e valor';
        }

        const { passageiro_id, motorista_id, latitude, longitude, valor } = dados;

        if (typeof passageiro_id !== 'number' || !Number.isSafeInteger(passageiro_id) || passageiro_id <= 0 ||
            typeof motorista_id !== 'number' || !Number.isSafeInteger(motorista_id) || motorista_id <= 0) {
            return 'Os IDs de passageiro e motorista devem ser inteiros positivos';
        }

        if (typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
            typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
            return 'Latitude ou longitude inválida';
        }

        if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
            return 'O valor deve ser um número maior que zero';
        }

        return undefined;
    }

    async findAll(req: Request, res: Response) {
        try {
            const rawPassageiroId = req.query.passageiro_id;
            const passageiro_id = rawPassageiroId === undefined
                ? undefined
                : this.parsePositiveInteger(rawPassageiroId);

            if (rawPassageiroId !== undefined && passageiro_id === undefined) {
                return res.status(400).json({ message: 'passageiro_id inválido' });
            }

            const rawLimit = req.query.limit;
            const limit = rawLimit === undefined ? 10 : this.parsePositiveInteger(rawLimit);
            if (limit === undefined || limit > 100) {
                return res.status(400).json({ message: 'limit deve ser um inteiro entre 1 e 100' });
            }

            const rawPage = req.query.page;
            const page = rawPage === undefined ? 1 : this.parsePositiveInteger(rawPage);
            if (page === undefined) {
                return res.status(400).json({ message: 'page deve ser um inteiro maior que 0' });
            }

            const camposOrdenacao = ['id', 'created_at', 'valor'];
            const ordenar = req.query.ordenar === undefined ? 'id' : req.query.ordenar;
            if (typeof ordenar !== 'string' || !camposOrdenacao.includes(ordenar)) {
                return res.status(400).json({ message: 'Campo de ordenação inválido' });
            }

            const direcao = req.query.direcao === undefined ? 'asc' : req.query.direcao;
            if (direcao !== 'asc' && direcao !== 'desc') {
                return res.status(400).json({ message: 'direcao deve ser asc ou desc' });
            }

            const corridas = await this.service.findAll(
                passageiro_id,
                limit,
                page,
                ordenar,
                direcao
            );

            if (corridas.length === 0) {
                return res.status(204).send();
            }

            return res.status(200).json({
                data: corridas,
                pagination: { page, limit }
            });
        } catch (err: any) {
            return res.status(err.status || 500).json({
                message: err.message || 'Erro interno'
            });
        }
    }

    async buscarCorridaPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = this.parsePositiveInteger(req.params.id);
            if (id === undefined) {
                res.status(400).json({ message: 'ID inválido' });
                return;
            }

            const corrida = await this.service.buscarCorridaPorId(id);
            if (!corrida) {
                res.status(404).json({ message: 'Corrida não encontrada' });
                return;
            }

            res.status(200).json(corrida);
        } catch (err: any) {
            res.status(err.status || 500).json({
                message: err.message || 'Erro interno do servidor'
            });
        }
    }

    async criarCorrida(req: Request, res: Response): Promise<void> {
        try {
            const erroValidacao = this.validarCorpoCorrida(req.body);
            if (erroValidacao) {
                res.status(400).json({ message: erroValidacao });
                return;
            }

            const corrida = await this.service.criarCorrida(req.body);
            res.status(201).json(corrida);
        } catch (err: any) {
            res.status(err.status || 500).json({
                message: err.message || 'Erro interno do servidor'
            });
        }
    }

    async atualizarCorrida(req: Request, res: Response): Promise<void> {
        try {
            const id = this.parsePositiveInteger(req.params.id);
            if (id === undefined) {
                res.status(400).json({ message: 'ID inválido' });
                return;
            }

            const erroValidacao = this.validarCorpoCorrida(req.body);
            if (erroValidacao) {
                res.status(400).json({ message: erroValidacao });
                return;
            }

            const corrida = await this.service.atualizarCorrida(id, req.body);
            if (!corrida) {
                res.status(404).json({ message: 'Corrida não encontrada' });
                return;
            }

            res.status(200).json(corrida);
        } catch (err: any) {
            res.status(err.status || 500).json({
                message: err.message || 'Erro interno do servidor'
            });
        }
    }

    async deletarCorrida(req: Request, res: Response): Promise<void> {
        try {
            const id = this.parsePositiveInteger(req.params.id);
            if (id === undefined) {
                res.status(400).json({ message: 'ID inválido' });
                return;
            }

            const sucesso = await this.service.deletarCorrida(id);
            if (!sucesso) {
                res.status(404).json({ message: 'Corrida não encontrada' });
                return;
            }

            res.status(204).send();
        } catch (err: any) {
            res.status(err.status || 500).json({
                message: err.message || 'Erro interno do servidor'
            });
        }
    }
}
