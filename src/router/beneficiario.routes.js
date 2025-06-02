import { Router } from 'express'
import { 
  getBeneficiarioById,
  getBeneficiarios,
  deleteBeneficiario,
  createBeneficiario,
  updateBeneficiario
} from '../controllers/beneficiario.controller.js'

const router = Router()

//rutas Rest para beneficiarios 
 router.get('/beneficiarios',getBeneficiarios)
 router.get('/beneficiarios/:id',getBeneficiarioById)
 router.post('/beneficiarios',createBeneficiario)
 router.put('/beneficiarios/:id',updateBeneficiario)
 router.delete('/beneficiarios/:id',deleteBeneficiario)
 export default router
