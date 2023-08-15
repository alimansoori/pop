import express, { NextFunction, Request, Response } from 'express'
import LeadModel from '../../models/lead/LeadModel'
import mongoose, { Model } from 'mongoose'
import {error} from "shelljs";

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

        const filter = LeadModel.find()
        const totalFilter = LeadModel.find()

        searchBuilder(filter, totalFilter, req.body)

        if (req.body?.order && req.body?.order.length && columns[req.body?.order[0]['column']]['name']) {
            const obj: any = {}
            obj[columns[req.body?.order[0]['column']]['name']] = req.body?.order[0]['dir']
            filter.sort(obj)
        } else {
            filter.sort({ 'source.updatedAt': 1 })
        }

        const leads = await filter.skip(start).limit(limit).exec()
        const totalCount = await totalFilter.countDocuments()

        res.status(200).json({
            draw: req.body.draw,
            files: [],
            options: {
                status: statusOptions(),
                'amazon.category': categoryOptions(),
                'source.availability': availabilityOptions(),
                'amazon.size': sizeOptions(),
            },
            recordsFiltered: totalCount,
            recordsTotal: totalCount,
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
                    'amazon.category': categoryOptions(),
                    'source.availability': availabilityOptions(),
                    'amazon.size': sizeOptions(),
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
        const data = req.body?.data
        const ids = Object.keys(data)

        if (!ids.length) {
            throw new Error('Error !')
        }

        const resData: any[] = []
        const errors: any[] = []
        for (let i = 0; i < ids.length; i++) {
            const lead = await LeadModel.findById(ids[i])

            if (!lead) {
                throw new Error('Lead for edit not exist!')
            }
            if (data[ids[i]]['hiddenDays'] !== undefined) {
                lead.hiddenDays = data[ids[i]]['hiddenDays']
            }
            if (data[ids[i]]['status']) {
                lead.status = data[ids[i]]['status']
            }
            if (data[ids[i]]['profit']) {
                lead.profit = data[ids[i]]['profit']
            }
            if (data[ids[i]]['roi']) {
                lead.roi = data[ids[i]]['roi']
            }
            if (data[ids[i]]['amazon']) {
                lead.amazon = {
                    ...lead.amazon.toObject(),
                    ...data[ids[i]]['amazon'],
                }
            }
            if (data[ids[i]]['source']) {
                lead.source = {
                    ...lead.source.toObject(),
                    ...data[ids[i]]['source'],
                }
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
                resData.push({
                    DT_RowId: lead._id,
                    ...lead.toObject(),
                })
            } else {
                errors.push(fieldErrors)
            }
        }

        res.status(200).json({
            data: resData,
            fieldErrors: error(),
        })
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
            if (
                !type &&
                !(error.path === 'status' || error.path === 'profit' || error.path === 'roi' || error.path === 'hidden')
            ) {
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

function availabilityOptions() {
    return [
        {
            label: 'In Stock',
            value: 1,
        },
        {
            label: 'Out of Stock',
            value: 0,
        },
    ]
}

function sizeOptions() {
    return [
        {
            label: 'SMALL STANDARD SIZE LESS THAN 6OZ',
            value: 'SMALL STANDARD SIZE LESS THAN 6OZ',
        },
        {
            label: 'SMALL STANDARD SIZE 6_12OZ',
            value: 'SMALL STANDARD SIZE 6_12OZ',
        },
        {
            label: 'SMALL STANDARD SIZE 12_16OZ',
            value: 'SMALL STANDARD SIZE 12_16OZ',
        },
        {
            label: 'LARGE STANDARD SIZE LESS THAN 6OZ',
            value: 'LARGE STANDARD SIZE LESS THAN 6OZ',
        },
        {
            label: 'LARGE STANDARD SIZE 6_12OZ',
            value: 'LARGE STANDARD SIZE 6_12OZ',
        },
        {
            label: 'LARGE STANDARD SIZE 12_16OZ',
            value: 'LARGE STANDARD SIZE 12_16OZ',
        },
        {
            label: 'LARGE STANDARD SIZE 1LBS_2LBS',
            value: 'LARGE STANDARD SIZE 1LBS_2LBS',
        },
        {
            label: 'LARGE STANDARD SIZE 2LBS_3LBS',
            value: 'LARGE STANDARD SIZE 2LBS_3LBS',
        },
        {
            label: 'LARGE STANDARD SIZE OVER 3LBS',
            value: 'LARGE STANDARD SIZE OVER 3LBS',
        },
        {
            label: 'SMALL OVERSIZE',
            value: 'SMALL OVERSIZE',
        },
        {
            label: 'MEDIUM OVERSIZE',
            value: 'MEDIUM OVERSIZE',
        },
        {
            label: 'LARGE OVERSIZE',
            value: 'LARGE OVERSIZE',
        },
        {
            label: 'SPECIAL OVERSIZE',
            value: 'SPECIAL OVERSIZE',
        },
        {
            label: 'SMALL STANDARD SIZE LESS THAN 6OZ CLOTHING',
            value: 'SMALL STANDARD SIZE LESS THAN 6OZ CLOTHING',
        },
        {
            label: 'SMALL STANDARD SIZE 6_12OZ CLOTHING',
            value: 'SMALL STANDARD SIZE 6_12OZ CLOTHING',
        },
        {
            label: 'SMALL STANDARD SIZE 12_16OZ CLOTHING',
            value: 'SMALL STANDARD SIZE 12_16OZ CLOTHING',
        },
        {
            label: 'LARGE STANDARD SIZE LESS THAN 6OZ CLOTHING',
            value: 'LARGE STANDARD SIZE LESS THAN 6OZ CLOTHING',
        },
        {
            label: 'LARGE STANDARD SIZE 6_12OZ CLOTHING',
            value: 'LARGE STANDARD SIZE 6_12OZ CLOTHING',
        },
        {
            label: 'LARGE STANDARD SIZE 12_16OZ CLOTHING',
            value: 'LARGE STANDARD SIZE 12_16OZ CLOTHING',
        },
        {
            label: 'LARGE STANDARD SIZE 1LBS_2LBS CLOTHING',
            value: 'LARGE STANDARD SIZE 1LBS_2LBS CLOTHING',
        },
        {
            label: 'LARGE STANDARD SIZE 2LBS_3LBS CLOTHING',
            value: 'LARGE STANDARD SIZE 2LBS_3LBS CLOTHING',
        },
        {
            label: 'LARGE STANDARD SIZE OVER 3LBS CLOTHING',
            value: 'LARGE STANDARD SIZE OVER 3LBS CLOTHING',
        },
    ]
}

function categoryOptions() {
    return [
        {
            label: 'Alexa Skills',
            value: 'Alexa Skills',
        },
        {
            label: 'Appliances',
            value: 'Appliances',
        },
        {
            label: 'Apps & Games',
            value: 'Apps & Games',
        },
        {
            label: 'Arts, Crafts & Sewing',
            value: 'Arts, Crafts & Sewing',
        },
        {
            label: 'Audible Books & Originals',
            value: 'Audible Books & Originals',
        },
        {
            label: 'Automotive',
            value: 'Automotive',
        },
        {
            label: 'Baby Products',
            value: 'Baby Products',
        },
        {
            label: 'Beauty & Personal Care',
            value: 'Beauty & Personal Care',
        },
        {
            label: 'Books',
            value: 'Books',
        },
        {
            label: 'CDs & Vinyl',
            value: 'CDs & Vinyl',
        },
        {
            label: 'Cell Phones & Accessories',
            value: 'Cell Phones & Accessories',
        },
        {
            label: 'Clothing, Shoes & Jewelry',
            value: 'Clothing, Shoes & Jewelry',
        },
        {
            label: 'Digital Music',
            value: 'Digital Music',
        },
        {
            label: 'Electronics',
            value: 'Electronics',
        },
        {
            label: 'Everything Else',
            value: 'Everything Else',
        },
        {
            label: 'Gift Cards',
            value: 'Gift Cards',
        },
        {
            label: 'Grocery & Gourmet Food',
            value: 'Grocery & Gourmet Food',
        },
        {
            label: 'Handmade Products',
            value: 'Handmade Products',
        },
        {
            label: 'Health & Household',
            value: 'Health & Household',
        },
        {
            label: 'Home & Kitchen',
            value: 'Home & Kitchen',
        },
        {
            label: 'Industrial & Scientific',
            value: 'Industrial & Scientific',
        },
        {
            label: 'Kindle Store',
            value: 'Kindle Store',
        },
        {
            label: 'Kitchen & Dining',
            value: 'Kitchen & Dining',
        },
        {
            label: 'Magazine Subscriptions',
            value: 'Magazine Subscriptions',
        },
        {
            label: 'Movies & TV',
            value: 'Movies & TV',
        },
        {
            label: 'Musical Instruments',
            value: 'Musical Instruments',
        },
        {
            label: 'Office Products',
            value: 'Office Products',
        },
        {
            label: 'Patio, Lawn & Garden',
            value: 'Patio, Lawn & Garden',
        },
        {
            label: 'Pet Supplies',
            value: 'Pet Supplies',
        },
        {
            label: 'Software',
            value: 'Software',
        },
        {
            label: 'Sports & Outdoors',
            value: 'Sports & Outdoors',
        },
        {
            label: 'Tools & Home Improvement',
            value: 'Tools & Home Improvement',
        },
        {
            label: 'Toys & Games',
            value: 'Toys & Games',
        },
        {
            label: 'Video Games',
            value: 'Video Games',
        },
        {
            label: 'Video Shorts',
            value: 'Video Shorts',
        },
        {
            label: 'Other',
            value: 'Other',
        },
    ]
}

function searchBuilder(filter: Model<any> | any, totalFilter: Model<any> | any, data: any) {
    const search = data?.search?.value
    if (search) {
        filter.or([
            { 'amazon.title': { $regex: search, $options: 'i' } },
            { 'source.title': { $regex: search, $options: 'i' } },
        ])
        totalFilter.or([
            { 'amazon.title': { $regex: search, $options: 'i' } },
            { 'source.title': { $regex: search, $options: 'i' } },
        ])
    }

    if (!data.searchBuilder) return

    const criteria: any[] = data?.searchBuilder['criteria']
    // console.log(data?.searchBuilder)

    const conditions = criteriaCalc(criteria)

    console.log(conditions)

    if (data?.searchBuilder['logic'] === 'AND') {
        filter.and(conditions)
        totalFilter.and(conditions)
    } else if (data.searchBuilder['logic'] === 'OR') {
        filter.or(conditions)
        totalFilter.or(conditions)
    }
}

function criteriaCalc(criteria: any[]): any {
    const conditions: any[] = []
    for (let i = 0; i < criteria.length; i++) {
        const condition: any = {}
        if (criteria[i]['condition'] === '=') {
            if (criteria[i]['type'] === 'num' || criteria[i]['type'] === 'num-fmt')
                condition[criteria[i]['origData']] = parseInt(criteria[i]['value1'])
            else if (criteria[i]['type'] === 'string' || criteria[i]['type'] === 'date')
                condition[criteria[i]['origData']] = criteria[i]['value1']
        } else if (criteria[i]['condition'] === '!=') {
            if (criteria[i]['type'] === 'num' || criteria[i]['type'] === 'num-fmt') {
                condition[criteria[i]['origData']] = { $ne: parseInt(criteria[i]['value1']) }
            } else if (criteria[i]['type'] === 'string' || criteria[i]['type'] === 'date')
                condition[criteria[i]['origData']] = { $ne: criteria[i]['value1'] }
        } else if (criteria[i]['condition'] === 'starts') {
            condition[criteria[i]['origData']] = new RegExp(`^${criteria[i]['value1']}`, 'i')
        } else if (criteria[i]['condition'] === '!starts') {
            condition[criteria[i]['origData']] = { $not: new RegExp(`^${criteria[i]['value1']}`, 'i') }
        } else if (criteria[i]['condition'] === 'contains' && criteria[i]['value1']) {
            condition[criteria[i]['origData']] = { $regex: criteria[i]['value1'] }
        } else if (criteria[i]['condition'] === '!contains' && criteria[i]['value1']) {
            condition[criteria[i]['origData']] = { $not: new RegExp(`${criteria[i]['value1']}`, 'i') }
        } else if (criteria[i]['condition'] === 'ends') {
            condition[criteria[i]['origData']] = { $regex: new RegExp(`${criteria[i]['value1']}$`, 'i') }
        } else if (criteria[i]['condition'] === '!ends') {
            condition[criteria[i]['origData']] = { $not: new RegExp(`${criteria[i]['value1']}$`, 'i') }
        } else if (criteria[i]['condition'] === 'null') {
            condition[criteria[i]['origData']] = { $exists: false }
        } else if (criteria[i]['condition'] === '!null') {
            condition[criteria[i]['origData']] = { $exists: true }
        } else if (criteria[i]['condition'] === '<') {
            condition[criteria[i]['origData']] =
              criteria[i]['type'] === 'date'
                ? { $lt: criteria[i]['value1'] }
                : { $lt: parseInt(criteria[i]['value1']) }
        } else if (criteria[i]['condition'] === '<=') {
            condition[criteria[i]['origData']] =
              criteria[i]['type'] === 'date'
                ? { $lte: criteria[i]['value1'] }
                : { $lte: parseInt(criteria[i]['value1']) }
        } else if (criteria[i]['condition'] === '>') {
            condition[criteria[i]['origData']] =
                criteria[i]['type'] === 'date'
                    ? { $gt: criteria[i]['value1'] }
                    : { $gt: parseInt(criteria[i]['value1']) }
        } else if (criteria[i]['condition'] === '>=') {
            condition[criteria[i]['origData']] =
                criteria[i]['type'] === 'date'
                    ? { $gte: criteria[i]['value1'] }
                    : { $gte: parseInt(criteria[i]['value1']) }
        } else if (criteria[i]['condition'] === 'between') {
            const betObj: any = {}
            if (criteria[i]['value1'])
                betObj['$gt'] = criteria[i]['type'] === 'date' ? criteria[i]['value1'] : parseInt(criteria[i]['value1'])
            if (criteria[i]['value2'])
                betObj['$lt'] = criteria[i]['type'] === 'date' ? criteria[i]['value2'] : parseInt(criteria[i]['value2'])
            condition[criteria[i]['origData']] = betObj
        } else if (criteria[i]['condition'] === '!between') {
            const betObj: any = {}
            if (criteria[i]['value1'])
                betObj['$gt'] = criteria[i]['type'] === 'date' ? criteria[i]['value1'] : parseInt(criteria[i]['value1'])
            if (criteria[i]['value2'])
                betObj['$lt'] = criteria[i]['type'] === 'date' ? criteria[i]['value2'] : parseInt(criteria[i]['value2'])
            condition[criteria[i]['origData']] = {
                $not: betObj,
            }
        } else if (criteria[i]['logic'] && typeof criteria[i]['logic'] === 'string') {
            if (criteria[i]['logic'] === 'AND') {
                condition['$and'] = criteriaCalc(criteria[i]['criteria'])
            } else if (criteria[i]['logic'] === 'OR') {
                condition['$or'] = criteriaCalc(criteria[i]['criteria'])
            }
        }
        conditions.push(condition)
    }

    return conditions
}

export default leadRoutes
