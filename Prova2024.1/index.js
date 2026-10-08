import express from 'express'
import { createDiariosRoutes } from './diarios/diarios.routes.js'

const app = express()

app.use(express.json())
app.use('/diario', createDiariosRoutes())

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000')
})
