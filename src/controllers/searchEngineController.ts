import { Request, Response } from 'express'
import User from '../model/user.model'
import { hash } from 'bcrypt'
import Google from '../lib/Google'

class SearchEngineController {
    public static FetchAsins = async (req: Request, res: Response) => {
        const bHash = await hash(req.body.password, 10)

        const userInput = {
            title: req.get('title'),
        }

        if (!userInput.title) {
            return res.status(400).send()
        }

        const google = new Google({
            title: userInput.title,
        })
        await google.search2()
        // console.log(google.getAsins())

        return res.send({
            message: 'User created',
            asins: google.getAsins(),
        })
    }
}

export default SearchEngineController
