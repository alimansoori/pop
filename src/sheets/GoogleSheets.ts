import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { keys } from '../keys'
import { Browser, Page } from 'puppeteer'
import SourceSiteFactory from '../stores/SourceSiteFactory'
import IStore from '../stores/IStore'
import Keepa from '../lib/Keepa'
import MyDate from '../lib/MyDate'
import { myPage } from '../lib/MyPage'
import { loadSetting, tomorrowDate, writeSetting } from '../lib/helper'
import CategorySheet from '../lib/CategorySheet'
import sleep from '../utils/sleep'
import { MyPuppeteer } from '../lib/MyPuppeteer'

export default class GoogleSheets {
    // private page
    // private category
    private settingFile: string | unknown
    private doc: any = ''
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
                'Source',
                // 'Sell Approval',
                'ASIN',
                'Source URL',
                // 'Source IMG',
                // 'Source Image',
                'Amazon URL',
                'Amazon Number',
                // 'Amazon IMG',
                // 'Amazon Image',
                'Category',
                'IN Stock',
                'Source Price',
                'Sell Price',
                'BuyBox Price',
                '30-D Amazon In Stock',
                'Badge',
                'BuyBox is Amazon',
                'BuyBox avg 30 day',
                'Top',
                'Net',
                'ROI',
                'BSR',
                'Package Quantity',
                'Note',
                'Signature',
            ])

            await this.iterateRows(dataBaseSheet)
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

    async sourceSite(page: Page, browser: Browser, url: string): Promise<IStore> {
        const store = await SourceSiteFactory.create(page, browser, url)
        console.log(store.getDomain())

        return store
    }

    async iterateRows(dataBaseSheet: GoogleSpreadsheetWorksheet) {
        const rows = await dataBaseSheet.getRows()
        const rowsLength = rows.length

        const startFrom = this.jsonSetting.row

        for (let i = startFrom; i < rowsLength; i++) {
            console.log('===================================')
            this.jsonSetting.row = i
            await writeSetting(this.jsonSetting, this.settingFile)

            // rows = await dataBaseSheet.getRows()
            // rowsLength = rows.length

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
            if (rows[i].Date && MyDate.dateDiff(current, updated) < 15) {
                console.log(`Next >>>`)
                continue
            }

            console.log(`Start Row: ${i + 2}`)
            // console.log(`Category: ${this.category}`)
            console.log(rows[i]['Amazon URL'])
            console.log(rows[i]['Source URL'])

            const amazonNumber: number = rows[i]['Amazon Number'] ? parseFloat(rows[i]['Amazon Number']) : 1

            // console.log(amazonNumber)

            try {
                /*const pup = new MyPuppeteer()
                await pup.build()
                const page = pup.page
                const browser = pup.browser*/
                const store = await this.sourceSite(rows[i]['Source URL'])
                await store.scrape()
                console.log('Source Price is: ' + store.getPrice())
                console.log('Source is in stock: ' + store.isAvailability())
                // await browser.close()

                // rows[i]['Amazon IMG'] = rows[i]['Amazon IMG']
                // rows[i]['Source IMG'] = rows[i]['Source IMG']
                // rows[i]['Source Image'] = rows[i]['Source Image']
                // rows[i]['Amazon Image'] = rows[i]['Amazon Image']

                if (store.getPrice() > 0 && store.isAvailability()) {
                    const keepa = new Keepa({
                        asin: rows[i].ASIN,
                        sourcePrice: store.getPrice() * amazonNumber,
                    })
                    await keepa.fetchByKeepa()
                    rows[i]['30-D Amazon In Stock'] = keepa.amazonInStock
                    rows[i]['Sell Price'] = keepa.sellPrice
                    rows[i]['Buy Box Price'] = keepa.sellPrice
                    rows[i].Badge = keepa.hasBadge
                    rows[i].Net = keepa.profit
                    rows[i].Category = keepa.category
                    rows[i].ROI = keepa.roi
                    rows[i].BSR = keepa.bsr
                    // rows[i]['Amazon IMG'] = keepa.image

                    if (keepa?.hasBadge && !keepa.buyBoxIsAmazon) {
                        // rows[i]['Date'] = this.currentDate()
                        rows[i].Date = tomorrowDate()
                        console.log('< ADDED >')
                    } else console.log('< REJECT >')
                } else console.log('< REJECT >')

                if (!store.productIsExist()) {
                    rows[i]['Note'] = 'Product Not Exist'
                }

                if (!store.getTitleClass().isValid()) {
                    rows[i]['Note'] = 'Title Invalid'
                }

                rows[i].Source = store.getDomain()

                // rows[i]['Image'] = `=I${i+2}`
                rows[i]['Source URL'] = store.getUrl()
                rows[i]['IN Stock'] = store.isAvailability() ? 'TRUE' : 'FALSE'
                rows[i]['Source Price'] = store.getPrice()
                await rows[i].save()
            } catch (e: any) {
                console.log(e.message)
                continue
            }
        }
    }
}
