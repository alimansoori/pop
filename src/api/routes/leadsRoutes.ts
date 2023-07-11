import express, { NextFunction, Request, Response } from 'express'
import LeadModel, { ILead } from '../../models/LeadModel'
import { error } from 'shelljs'
import mongoose, { Document, Model, ObjectId, Query } from 'mongoose'

const leadRoutes = express.Router()

leadRoutes.post('/', async (req, res, next) => {
    try {
        // console.log(req.body)
        if (req.body?.draw) {
            await getLeads(req, res, next)
        } else if (req.body?.action === 'create') {
            await createLead(req, res, next)
        } else if (req.body?.action === 'edit') {
            await editLead(req, res, next)
        } else if (req.body?.action === 'remove') {
            await deleteLead(req, res, next)
        }
    } catch (e: any) {
        res.status(404).json({
            error: e.message,
        })
    }
})

async function getLeads(req: Request, res: Response, next: NextFunction) {
    try {
        const start = req.body?.start ? req.body?.start : 0
        const limit = req.body?.length ? req.body?.length : 10
        const search = req.body?.search?.value
        const columns = req.body?.columns.length ? req.body?.columns : []

        // console.log(columns[req.body?.order[0]['column']])
        // console.log(columns[req.body?.order[0]['column']]['name'])

        let filter = LeadModel.find().skip(start).limit(limit)

        filter = searchBuilder(filter, req.body)

        if (search) {
            filter.or([
                { 'amazon.title': { $regex: search, $options: 'i' } },
                { 'source.title': { $regex: search, $options: 'i' } },
            ])
        }

        const leads = await filter.exec()

        res.status(200).json({
            draw: req.body.draw,
            files: [],
            options: {
                status: statusOptions(),
            },
            recordsFiltered: await LeadModel.countDocuments(),
            recordsTotal: await LeadModel.countDocuments(),
            message: 'This is GET /leads',
            data: leads.map((lead) => {
                return {
                    DT_RowId: lead._id,
                    ...lead.toObject(),
                }
            }),
            searchBuilder: {
                options: {
                    status: statusOptions(),
                },
            },
        })
    } catch (e: any) {
        res.status(404).json({
            error: e.message,
        })
    }
}

async function createLead(req: Request, res: Response, next: NextFunction) {
    try {
        // console.log(req.body?.data[0])
        const lead = new LeadModel(req.body?.data[0])
        const leadValidationError = lead.validateSync()
        const leadAmazonValidationError = lead.amazon.validateSync()
        const leadSourceValidationError = lead.source.validateSync()

        const fieldErrors = []
        if (leadValidationError instanceof mongoose.Error.ValidationError) {
            fieldErrors.push(...validationCalc(leadValidationError, ''))
        }
        if (leadAmazonValidationError instanceof mongoose.Error.ValidationError) {
            fieldErrors.push(...validationCalc(leadAmazonValidationError, 'amazon'))
        }
        if (leadSourceValidationError instanceof mongoose.Error.ValidationError) {
            fieldErrors.push(...validationCalc(leadSourceValidationError, 'source'))
        }
        if (!fieldErrors.length) {
            await lead.save()
            res.status(200).json({
                data: [
                    {
                        DT_RowId: lead._id,
                        ...lead.toObject(),
                    },
                ],
            })
        } else {
            res.status(200).json({
                data: [],
                fieldErrors: fieldErrors,
            })
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(404).json({
            error: error?.message,
        })
    }
}

async function editLead(req: Request, res: Response, next: NextFunction) {
    try {
        // console.log(req.body?.data)
        const data = req.body?.data
        const ids = Object.keys(data)

        if (!ids.length) {
            throw new Error('Error !')
        }

        const lead = await LeadModel.findById(ids[0])
        if (!lead) {
            throw new Error('Lead for edit not exist!')
        }

        if (data[ids[0]]['status']) {
            lead.status = data[ids[0]]['status']
        }

        if (data[ids[0]]['profit']) {
            lead.profit = data[ids[0]]['profit']
        }

        if (data[ids[0]]['roi']) {
            lead.roi = data[ids[0]]['roi']
        }

        if (data[ids[0]]['amazon']) {
            lead.amazon = data[ids[0]]['amazon']
        }

        if (data[ids[0]]['source']) {
            lead.source = data[ids[0]]['source']
        }

        const leadValidationError = lead.validateSync()
        const leadAmazonValidationError = lead.amazon.validateSync()
        const leadSourceValidationError = lead.source.validateSync()

        const fieldErrors = []
        if (leadValidationError instanceof mongoose.Error.ValidationError) {
            fieldErrors.push(...validationCalc(leadValidationError, ''))
        }
        if (leadAmazonValidationError instanceof mongoose.Error.ValidationError) {
            fieldErrors.push(...validationCalc(leadAmazonValidationError, 'amazon'))
        }
        if (leadSourceValidationError instanceof mongoose.Error.ValidationError) {
            fieldErrors.push(...validationCalc(leadSourceValidationError, 'source'))
        }
        if (!fieldErrors.length) {
            await lead.save()
            res.status(200).json({
                data: [
                    {
                        DT_RowId: lead._id,
                        ...lead.toObject(),
                    },
                ],
            })
        } else {
            res.status(200).json({
                data: [],
                fieldErrors: fieldErrors,
            })
        }
    } catch (e: any) {
        res.status(404).json({
            error: e.message,
        })
    }
}

async function deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
        const ids: string[] = Object.keys(req.body?.data)
        if (req.body?.data && ids.length) {
            for (let i = 0; i < ids.length; i++) {
                try {
                    await LeadModel.deleteOne({ _id: ids[i] })
                } catch (e: any) {
                    console.log('Error in delete')
                }
            }
        }
        res.status(200).json({
            message: 'This is Delete /leads',
            data: [],
        })
    } catch (e: any) {
        res.status(404).json({
            error: e.message,
        })
    }
}

function validationCalc(
    validationError: mongoose.Error.ValidationError,
    type: string
): { name: string; status: string }[] {
    const fieldsErrors: any[] = []
    const errors = validationError.errors
    const errorKeys = Object.keys(validationError.errors)
    for (let i = 0; i < errorKeys.length; i++) {
        const error = errors[errorKeys[i]]
        if (error instanceof mongoose.Error.ValidatorError) {
            if (!type && !(error.path === 'status' || error.path === 'profit' || error.path === 'roi')) {
                continue
            }
            fieldsErrors.push({
                status: error.message,
                name: type ? type + '.' + error.path : error.path,
            })
        }
    }

    const uniqueArray = fieldsErrors.filter((item, index) => {
        return fieldsErrors.indexOf(item) === index
    })

    return uniqueArray
}

function statusOptions() {
    return [
        {
            label: 'Match',
            value: 'match',
        },
        {
            label: 'Mismatch',
            value: 'mis_match',
        },
        {
            label: 'Not check',
            value: 'not_checked',
        },
    ]
}

function searchBuilder(filter: Model<any> | any, data: any) {
    // if (!data.searchBuilder) return filter

    // for (let i = 0; i < data.searchBuilder['criteria']; i++) {}
    /*const stat = 'status'
    const profit = 'profit'

    const obj: any = {}
    obj[stat] = 'not_checked'

    const objProfit: any = {}
    objProfit[profit] = 8*/

    /*if (data.searchBuilder?.logic === 'AND') {
        filter.and()
    } else if (data.searchBuilder?.logic === 'AND') {
        filter.or([{ status: { $regex: 'not_checked', $options: 'i' } }, { profit: { $regex: 8, $options: 'i' } }])
    }*/
    /*console.log([obj, objProfit])
    filter.or([obj, objProfit])*/
    return filter
}

export default leadRoutes
