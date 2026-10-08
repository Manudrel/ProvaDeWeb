import { db } from '../db/connection';

export class MotoristaRepository {
    async buscarStatus(id: number): Promise<string | undefined> {
        const motorista = await db('motoristas')
            .select('status')
            .where('id', id)
            .first();

        return motorista?.status;
    }
}
