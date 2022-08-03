import {Request, Response} from "express"

class IndexController {
    public static Index = (req: Request, res: Response, next: any) => {
        res.render('layouts/layout')
    }
}

export default IndexController