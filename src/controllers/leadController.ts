import { Request, Response } from 'express'
import Lead from '../model/lead.model'

class LeadController {
    public static CreateLead = async (req: Request, res: Response) => {
        await Lead.create(req.body)
        return res.send({
            message: 'Lead created',
        })
    }
}

export default LeadController
