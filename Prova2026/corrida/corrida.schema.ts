export interface Corrida {
    id: number;
    passageiro_id: number;
    motorista_id: number;
    latitude: number;
    longitude: number;
    valor: number;
    created_at: Date;    
}

export type NovaCorrida = Omit<Corrida, 'id' | 'created_at'>;
