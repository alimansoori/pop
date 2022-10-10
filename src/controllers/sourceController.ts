import { Request, Response } from 'express'
import Source from '../model/source.model'

class SourceController {
    public static CreateSource = async (req: Request, res: Response) => {
        const sourceInput = {
            title: 'kkk',
            url: 'ddd',
        }

        await Source.create(sourceInput)
        return res.send({
            message: 'Source created',
        })
    }
}

export default SourceController
