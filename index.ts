import express from 'express';
import { createCorridaRouter } from './corrida/corrida.routes';
const app = express();

app.use(express.json());

app.use('/corridas', createCorridaRouter());

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})