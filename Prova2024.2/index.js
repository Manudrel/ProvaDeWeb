import express from 'express'
import { createJogadoresRoutes } from './jogadores/jogadores.routes.js'
import { createJogosRoutes } from './jogos/jogos.routes.js'

const app = express()
app.use(express.json())

app.use('/jogadores', createJogadoresRoutes())
app.use('/jogos', createJogosRoutes())

app.listen(3000, ()=>{
    console.log('Tá funcionando Diegão, confia')
})
