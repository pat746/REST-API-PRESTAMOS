import { Router } from 'express'
import { 
  getBeneficiarioById,
  getBeneficiarios,
  deleteBeneficiario,
  updateBeneficiario
} from '../controllers/beneficiario.controller.js'

const router = Router()

//rutas Rest para beneficiarios 
 router.get('/beneficiarios',getBeneficiarios)

 export default router
