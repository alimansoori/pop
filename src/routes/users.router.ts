import { Router } from 'express'
import UsersController from '../controllers/usersController'

const UserRouter = Router()

UserRouter.post('/api/1.0/users', UsersController.CreateUser)

export default UserRouter
