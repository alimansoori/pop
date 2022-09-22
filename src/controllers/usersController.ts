import { Request, Response } from 'express'
import User from '../model/user.model'
import { hash } from 'bcrypt'

class UsersController {
    public static CreateUser = async (req: Request, res: Response) => {
        const bHash = await hash(req.body.password, 10)

        const userInput = {
            username: req.body.username,
            email: req.body.email,
            password: bHash,
        }

        if (!userInput.username) {
            return res.status(400).send()
        }

        await User.create(userInput)

        return res.send({
            message: 'User created',
        })
    }
}

export default UsersController
