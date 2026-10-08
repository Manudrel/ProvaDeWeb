import { db } from '../db/connection';

export class UsuarioRepository {
    async existe(id: number): Promise<boolean> {
        const usuario = await db('usuarios')
            .select('id')
            .where('id', id)
            .first();

        return usuario !== undefined;
    }
}
