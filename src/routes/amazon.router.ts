import { Router } from 'express'
import AmazonController from '../controllers/amazonController'

const AmazonRouter = Router()

AmazonRouter.post('/api/1.0/amazon', AmazonController.CreateAmazon)

export default AmazonRouter
