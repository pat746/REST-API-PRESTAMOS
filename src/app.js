//const express = require('express')
//Ecmascript module - hablilitar en package.json
import express from 'express'
//import {pool} from './db.js'
import beneficiario from './router/beneficiario.routes.js'
import contrato from './router/contrato.routes.js'
import pago from './router/pago.routes.js'

const app = express()

app.use(express.json()) //server recibe el json 
app.use('/api/',beneficiario);
app.use('/api/',contrato);
app.use('/api/',pago);

export default app