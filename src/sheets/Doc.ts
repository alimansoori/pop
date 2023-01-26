import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { keys } from '../keys'
import sleep from '../utils/sleep'

export default class Doc {
    private doc1: any = ''
    private doc2: any = ''
    private jsonSetting: any = {}

    constructor() {}

    async auth() {
        try {
            this.doc1 = new GoogleSpreadsheet('18-IBVjrZF8z5OGfSvFWmIQmLG5Ki4-_RB0D6T5g8yLg')
            this.doc2 = new GoogleSpreadsheet('1fjwqjn7xHaxZx_fRIRZn1Dby4xhvs2LsU7ZCBh9kzKw')

            await this.doc1.useServiceAccountAuth({
                client_email: keys.client_email,
                private_key: keys.private_key,
            })
            await this.doc2.useServiceAccountAuth({
                client_email: keys.client_email,
                private_key: keys.private_key,
            })

            await this.doc1.loadInfo()
            await this.doc2.loadInfo()
            const badAsinSheet = await this.doc1.sheetsByTitle.asin
            const dataBaseSheet = await this.doc2.sheetsByTitle.data

            await badAsinSheet.setHeaderRow(['ASIN'])

            await dataBaseSheet.setHeaderRow([
                'Date',
                'Status',
                'Approval',
                'Title',
                'ASIN',
                'Source',
                'Source URL',
                'Amazon URL',
                'Amazon Number',
                'Brand',
                'Category',
                'Signature',
                'IN Stock',
                'Source Price',
                'Sell Price',
                'StatusCode',
                'Seller',
                'Note',
            ])

            await this.iterateRows(badAsinSheet, dataBaseSheet)
        } catch (e: any) {
            await sleep(2000)
            await this.auth()
            console.log(e.message)
        }
    }

    async iterateRows(badAsinSheet: GoogleSpreadsheetWorksheet, dataBaseSheet: GoogleSpreadsheetWorksheet) {
        const databaseRows = await dataBaseSheet.getRows()
        const badAsinRows = await badAsinSheet.getRows()

        for (let i = 1; i < databaseRows.length; i++) {
            console.log(`Row = ${i}`)
            const databaseAsin = databaseRows[i]['ASIN']
            try {
                for (let j = 1; j < badAsinRows.length; j++) {
                    if (databaseAsin === badAsinRows[j]['ASIN']) {
                        console.log(databaseAsin + ' => ' + badAsinRows[j]['ASIN'])
                        console.log(`Delete Row = ${i}`)
                        databaseRows[i]['Note'] = 'Delete'
                        await databaseRows[i].save()
                        break
                    }
                }
            } catch (e: any) {
                console.log(e.message)
                continue
            }
        }
    }
}
