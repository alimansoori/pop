import { Router } from 'express'
import UsersController from '../controllers/usersController'

const SearchEngineRouter = Router()

SearchEngineRouter.post('/api/1.0/search-engine', UsersController.CreateUser)

export default SearchEngineRouter
