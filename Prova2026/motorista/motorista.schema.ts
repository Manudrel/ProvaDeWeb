
export interface Motorista {
    id: number;
    usuario_id: number;
    cnh: string;
    status: 'ativo' | 'inativo';
    created_at: Date;
}

export type NovoMotorista = Omit<Motorista, 'id' | 'created_at'>;
