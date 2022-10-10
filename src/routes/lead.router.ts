import { Router } from 'express'
import LeadController from '../controllers/leadController'

const LeadRouter = Router()

LeadRouter.post('/api/1.0/lead', LeadController.CreateLead)

export default LeadRouter
