import { Router } from 'express'
import {
  getContratos,
  getContratoById,
  getContratosByDni,
  createContrato,
  updateContrato,
  deleteContrato
} from '../controllers/contrato.controller.js'

const router = Router()

router.get('/contratos', getContratos)
router.get('/contratos/:id', getContratoById)
router.get('/contratos/dni/:dni', getContratosByDni)  // Buscar contratos por DNI
router.post('/contratos', createContrato)
router.put('/contratos/:id', updateContrato)
router.delete('/contratos/:id', deleteContrato)

export default router
