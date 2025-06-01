//const express = require('express')
//Ecmascript module - hablilitar en package.json
import express from 'express'
//import {pool} from './db.js'
import softwareRouters from './router/beneficiario.routes.js'

const app = express()

app.use(express.json()) //server recibe el json 
app.use('/api/',softwareRouters);

export default app