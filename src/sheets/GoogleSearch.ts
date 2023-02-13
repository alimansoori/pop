import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { keys } from '../keys'
import { loadSetting, writeSetting } from '../lib/helper'
import CategorySheet from '../lib/CategorySheet'
import { sleep } from '../utils/sleep'
import Google from '../lib/Google'

export default class GoogleSearch {
    // private page
    // private category
    private settingFile: string | unknown
    private doc: any = ''
    private jsonSetting: any = {}

    constructor(settingFile: string | unknown) {
        this.settingFile = settingFile

        this.auth()
    }

    async auth() {
        try {
            this.jsonSetting = await loadSetting(this.settingFile)
            this.doc = new GoogleSpreadsheet(CategorySheet.selectSheetKey(this.jsonSetting.cat))
            await this.doc.useServiceAccountAuth({
                client_email: keys.client_email,
                private_key: keys.private_key,
            })

            await this.doc.loadInfo()
            const dataBaseSheet = await this.doc.sheetsByTitle.data

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

            await this.iterateRows(dataBaseSheet)
        } catch (e: any) {
            await sleep(2000)
            await this.auth()
            console.log(e.message)
        }
    }

    async iterateRows(dataBaseSheet: GoogleSpreadsheetWorksheet) {
        const rows = await dataBaseSheet.getRows()
        const rowsLength = rows.length
        const startFrom = this.jsonSetting.row

        for (let i = startFrom; i < rowsLength; i++) {
            console.log('===================================')
            this.jsonSetting.row = i
            await writeSetting(this.jsonSetting, this.settingFile)

            if (rows[i]['ASIN'] || !rows[i]['Title']) {
                continue
            }

            console.log(`Start Row: ${i + 2}`)

            try {
                console.log(rows[i]['Title'])

                const google = new Google({
                    title: rows[i]['Title'],
                })
                await google.search2()

                console.log('AMZ URL: ' + google.amazonUrl)
                console.log('ASIN: ' + google.asin)
                rows[i]['ASIN'] = google.asin
                rows[i]['Amazon URL'] = google.amazonUrl

                await rows[i].save()
            } catch (e: any) {
                console.log(e.message)
                continue
            }
        }
    }
}
