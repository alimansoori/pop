import { Request, Response } from 'express'
import Amazon from '../model/amazon.model'

class AmazonController {
    public static CreateAmazon = async (req: Request, res: Response) => {
        const sourceInput = {
            title: 'kkk',
            asin: 'ddd',
            url: 'ddd',
        }

        await Amazon.create(sourceInput)

        return res.send({
            message: 'Amazon created',
        })
    }
}

export default AmazonController
