import { Request, Response } from 'express'

class IndexController {
    public static Index = (req: Request, res: Response) => {
        // const amz = new AmazonModel({title: "ddd"})
        // console.log(amz.id)
        res.render('layouts/layout')
    }
}

export default IndexController
