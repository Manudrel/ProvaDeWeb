import knex from 'knex';

export const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        database: 'eevee',
        user: 'postgres',
        password: 'postgres'
    },
    pool:{
        min: 2,
        max: 10
    }
})