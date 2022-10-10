import { Router } from 'express'
import SourceController from '../controllers/sourceController'

const SourceRouter = Router()

SourceRouter.post('/api/1.0/sources', SourceController.CreateSource)

export default SourceRouter
