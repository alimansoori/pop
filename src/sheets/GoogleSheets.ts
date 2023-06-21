import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { keys } from '../keys'

import SourceSiteFactory from '../stores/SourceSiteFactory'
import IStore from '../stores/IStore'
import Keepa from '../lib/Keepa'
import MyDate from '../lib/MyDate'
import { loadSetting, tomorrowDate, writeSetting } from '../lib/helper'
import CategorySheet from '../lib/CategorySheet'
import { sleep } from '../utils/sleep'
import { DbApi } from '../lib/db-api/DbApi'

export default class GoogleSheets {
    // private page
    // private category
    private settingFile: string | unknown
    private doc: any = ''
    private leads: any = ''
    private jsonSetting: any = {}

    constructor(settingFile: string | unknown) {
        // this.category = category
        this.settingFile = settingFile

        this.auth()
    }

    async auth() {
        try {
            this.jsonSetting = await loadSetting(this.settingFile)

            this.doc = new GoogleSpreadsheet(CategorySheet.selectSheetKey(this.jsonSetting.cat))
            this.leads = new GoogleSpreadsheet(CategorySheet.selectSheetKey('leads'))

            await this.doc.useServiceAccountAuth({
                // env var values are copied from service account credentials generated by google
                // see "Authentication" section in docs for more info
                client_email: keys.client_email,
                private_key: keys.private_key,
            })

            await this.leads.useServiceAccountAuth({
                // env var values are copied from service account credentials generated by google
                // see "Authentication" section in docs for more info
                client_email: keys.client_email,
                private_key: keys.private_key,
            })

            await this.doc.loadInfo()
            await this.leads.loadInfo()
            const dataBaseSheet = await this.doc.sheetsByTitle.data
            const dataBaseLeads = await this.leads.sheetsByTitle.data

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

            await dataBaseLeads.setHeaderRow([
                'Date',
                'Status',
                'Approval',
                'Title',
                'Asin',
                'Source',
                'Source_URL',
                'Amazon_URL',
                'Amazon_Number',
                'Brand',
                'Category',
                'Signature',
                'Note',
            ])

            await this.iterateRows(dataBaseSheet, dataBaseLeads)
        } catch (e: any) {
            await sleep(2000)
            await this.auth()
            console.log(e.message)
        }
    }

    currentDate(): string {
        const ddd = new Date()
        const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(ddd)
        const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(ddd)
        const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(ddd)

        return `${month}/${day}/${year}`
    }

    async sourceSite(url: string): Promise<IStore> {
        const store = await SourceSiteFactory.create(url)
        console.log(store.getDomain())

        return store
    }

    async iterateRows(dataBaseSheet: GoogleSpreadsheetWorksheet, dataBaseLeads: GoogleSpreadsheetWorksheet) {
        const rows = await dataBaseSheet.getRows()
        const rowsLength = rows.length

        const startFrom = this.jsonSetting.row

        for (let i = startFrom; i < rowsLength; i++) {
            const lead = {}
            console.log('===================================')
            this.jsonSetting.row = i
            await writeSetting(this.jsonSetting, this.settingFile)

            if (i >= rowsLength - 2) {
                i = 0
                continue
            }

            if (!rows[i]['Source URL'] || !rows[i]['Amazon URL']) {
                console.log(`>>>> row ${rows[i].rowIndex} Source URL OR Amazon URL not exist`)
                continue
            }

            const updated = new Date(rows[i].Date)
            const current = new Date(this.currentDate())
            if (rows[i].Date && MyDate.dateDiff(current, updated) < 10) {
                console.log(`Next >>>`)
                continue
            }

            console.log(`Start Row: ${i + 2}`)
            console.log(rows[i]['Amazon URL'])
            console.log(rows[i]['Source URL'])

            const amazonNumber: number = rows[i]['Amazon Number'] ? parseFloat(rows[i]['Amazon Number']) : 1

            try {
                const store = await this.sourceSite(rows[i]['Source URL'])
                await store.createBrowser()
                await store.scrape()
                await store.browser?.close()
                console.log('Source Title is: ' + store.getTitleClass().getTitle())
                console.log('Source UPC is: ' + store.getUPC())
                console.log('Source Price is: ' + store.getPrice())
                console.log('Source Image is: ' + store.getImage())
                console.log('Source Price is: ' + store.getPrice())
                console.log('Source is in stock: ' + store.isAvailability())

                if (store.getPrice() > 0 && store.isAvailability()) {
                    const keepa = new Keepa({
                        asin: rows[i].ASIN,
                        sourcePrice: store.getPrice() * amazonNumber,
                        configPath: './config.json',
                    })
                    await keepa.fetchByKeepa()
                    rows[i]['Sell Price'] = keepa.sellPrice
                    rows[i]['Brand'] = keepa.brand
                    rows[i]['Seller'] = keepa.buyBoxIsAmazon ? 'Amazon' : ''
                    rows[i].Category = keepa.category

                    if (keepa?.hasBadge) {
                        if (!keepa.buyBoxIsAmazon) {
                            // rows[i]['Date'] = this.currentDate()
                            rows[i]['Date'] = tomorrowDate()

                            // Add Row in DataBase Leads
                            await dataBaseLeads.addRow({
                                Date: tomorrowDate(),
                                Status: rows[i]['Status'],
                                Approval: rows[i]['Approval'],
                                Title: store.getTitleClass().getTitle(),
                                Asin: rows[i]['ASIN'],
                                // @ts-ignore
                                Source: store.getDomain() ? store.getDomain() : '',
                                Source_URL: store.getUrl(),
                                Amazon_URL: rows[i]['Amazon URL'],
                                Amazon_Number: amazonNumber,
                                // @ts-ignore
                                Brand: keepa.brand,
                                Category: keepa.category,
                            })
                            console.log('< ADDED >')
                        } else {
                            console.log('< REJECT >')
                        }
                    } else {
                        console.log('< REJECT >')
                    }
                } else {
                    console.log('< REJECT >')
                }

                rows[i]['StatusCode'] = store.statusCode

                if (store.error) {
                    rows[i]['Note'] = store.error
                }

                rows[i].Source = store.getDomain()

                rows[i]['Title'] = store.getTitleClass().getTitle()
                rows[i]['Product Image'] = JSON.stringify(store.getImage())
                rows[i]['Source URL'] = store.getUrl()
                rows[i]['Source UPC'] = store.getUPC()
                rows[i]['IN Stock'] = store.isAvailability() ? 'TRUE' : 'FALSE'
                rows[i]['Source Price'] = store.getPrice()
                await rows[i].save()

                // await this.afterSave(rows[i], store.getImage())
            } catch (e: any) {
                console.log(e.message)
                continue
            }
        }
    }

    private async afterSave(row: any, images: string[]) {
        // Add product to DbApi
        try {
            const addProductFromGoogleSheetInput: IProductInput = {
                link: row['Source URL'],
                title: row['Title'],
                asin: row['ASIN'],
                src: row['Source'],
                brand: row['Brand'],
                category: row['Category'],
            }
            if (images.length > 0) {
                addProductFromGoogleSheetInput['images'] = images
            }
            await DbApi.addProductFromGoogleSheet(addProductFromGoogleSheetInput)
        } catch (e: any) {
            console.log(e.message)
        }
    }
}
