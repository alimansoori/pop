import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { keys } from '../keys'

import { loadSetting, writeSetting } from '../lib/helper'
import CategorySheet from '../lib/CategorySheet'
import { sleep } from '../utils/sleep'
import axios from 'axios'

export default class ImportFromGoogleSheet {
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
                // env var values are copied from service account credentials generated by google
                // see "Authentication" section in docs for more info
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
                'Source UPC',
                'Product Image',
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
            this.jsonSetting.row = i
            await writeSetting(this.jsonSetting, this.settingFile)

            /*if (i >= rowsLength - 2) {
                i = 0
                continue
            }*/

            if (!rows[i]['Source URL']) {
                console.log(`>>>> row ${rows[i].rowIndex} Source URL OR Amazon URL not exist`)
                continue
            }

            let status = 'not_checked'

            if (rows[i]['Status'] === 'Match') status = 'match'
            if (rows[i]['Status'] === 'Mismatch') status = 'mis_match'

            try {
                await axios.post('http://localhost:3000/api/1.0/leads', {
                    data: [
                        {
                            status: status,
                            matchQuality: rows[i]['Amazon Number'],
                            amazon: {
                                asin: rows[i]['ASIN'],
                            },
                            source: {
                                url: rows[i]['Source URL'],
                            },
                        },
                    ],
                    action: 'create',
                })

                console.log(`Import Row: ${i + 2}`)
            } catch (e: any) {
                console.log(e.message)
            }
        }
    }
}
