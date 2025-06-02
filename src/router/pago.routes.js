import { Router } from 'express'
import {
  getPagos,
  getPagoById,
  getPagosByContrato,
  getPagosPendientes,
  registrarPago,
  deletePago,
  getResumenPorMedio
} from '../controllers/pago.controller.js'

const router = Router()

router.get('/pagos', getPagos)
router.get('/pagos/:id', getPagoById)
router.get('/contrato/:idcontrato', getPagosByContrato)
router.get('/pendientes/:idcontrato', getPagosPendientes)
router.get('/resumen/:idcontrato', getResumenPorMedio)
router.put('/registrar', registrarPago)
router.delete('/:id', deletePago)

export default router
