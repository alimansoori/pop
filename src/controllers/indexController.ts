import {Request, Response} from "express"
import AmazonModel from "../model/amazon.model";

class IndexController {
    public static Index = (req: Request, res: Response, next: any) => {
        // const amz = new AmazonModel({title: "ddd"})
        // console.log(amz.id)
        res.render('layouts/layout')
    }
}

export default IndexController