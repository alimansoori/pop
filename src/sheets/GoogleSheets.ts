import {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} from "google-spreadsheet"
import {keys} from "../keys";
import {Page} from "puppeteer";
import SourceSiteFactory from "../stores/SourceSiteFactory";
import IStore from "../stores/IStore";
import Keepa from "../lib/Keepa";
import MyDate from "../lib/MyDate";
import {myPage} from "../lib/MyPage";

export default class GoogleSheets {
    // private page
    private doc
    private startFrom: number
    private dateSave: string

    constructor(startFrom: any, dateSave: any) {
        this.doc = new GoogleSpreadsheet('15Xz1TZJKkOG5O5fZ7MeH6hQKoS4in8g-VF8dRBnczKY')
        // this.page = page
        this.startFrom = parseInt(startFrom)
        this.dateSave = dateSave

        this.auth()
    }

    async auth() {

        await this.doc.useServiceAccountAuth({
            // env var values are copied from service account credentials generated by google
            // see "Authentication" section in docs for more info
            client_email: keys.client_email,
            private_key: keys.private_key,
        });

        await this.doc.loadInfo()
        const dataBaseSheet = await this.doc.sheetsByTitle['test']

        await dataBaseSheet.setHeaderRow([
            'Date',
            'Source',
            'Sell Approval',
            'ASIN',
            'Source URL',
            'Source IMG',
            'Source Image',
            'Amazon URL',
            'Amazon Number',
            'Amazon IMG',
            'Amazon Image',
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
            'Signature',
        ])

        try {
            /*const store = await this.sourceSite("https://www.theisens.com/products/2-cup-jelly-2-orange-slice-hanging-oriole-feeder/")
            await store.scrape()
            console.log("Source Price is: " + store.getPrice())
            console.log("Source is in stock: " + store.isAvailability())*/

            await this.iterateRows(dataBaseSheet)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    currentDate(): string {
        let ddd = new Date()
        let month = new Intl.DateTimeFormat('en', {month: "short"}).format(ddd)
        let day = new Intl.DateTimeFormat('en', {day: "2-digit"}).format(ddd)
        let year = new Intl.DateTimeFormat('en', {year: "numeric"}).format(ddd)

        return `${month}/${day}/${year}`
    }

    async sourceSite(page: Page, url: string): Promise<IStore> {

        const store = await SourceSiteFactory.create(
            page,
            url
        )

        console.log(store.getDomain())

        return store
    }

    async iterateRows(dataBaseSheet: GoogleSpreadsheetWorksheet) {
        let rows = await dataBaseSheet.getRows()
        let rowsLength = rows.length

        for (let i = this.startFrom; i < rowsLength; i++) {
            rows = await dataBaseSheet.getRows()
            rowsLength = rows.length

            if (i >= (rowsLength - 2)) {
                i = 0
                continue
            }

            if (!rows[i]['Source URL'] || !rows[i]['Amazon URL']) {
                console.log(`>>>> row ${rows[i].rowIndex} Source URL OR Amazon URL not exist`)
                continue
            }

            const updated = new Date(rows[i]['Date'])
            const current = new Date(this.currentDate())
            if (rows[i]['Date'] && MyDate.dateDiff(current, updated) < 30) {
                console.log(`Next >>>`)
                continue
            }

            console.log(`Start Row: ${i+2}`)
            console.log(rows[i]['Amazon URL'])
            console.log(rows[i]['Source URL'])

            const amazonNumber: number = rows[i]['Amazon Number'] ? parseFloat(rows[i]['Amazon Number']) : 1

            // console.log(amazonNumber)

            try {
                const page = await myPage()
                const store = await this.sourceSite(page, rows[i]['Source URL'])
                await store.scrape()
                console.log("Source Price is: " + store.getPrice())
                console.log("Source is in stock: " + store.isAvailability())
                await page.close()

                rows[i]['Amazon IMG'] = rows[i]['Amazon IMG']
                rows[i]['Source IMG'] = rows[i]['Source IMG']
                rows[i]['Source Image'] = rows[i]['Source Image']
                rows[i]['Amazon Image'] = rows[i]['Amazon Image']

                if (store.getPrice() > 0 && store.isAvailability()) {
                    const keepa = new Keepa({
                        asin: rows[i]['ASIN'],
                        sourcePrice: store.getPrice() * amazonNumber
                    })
                    await keepa.fetchByKeepa()
                    rows[i]['30-D Amazon In Stock'] = keepa.amazonInStock
                    rows[i]['Sell Price'] = keepa.sellPrice
                    rows[i]['Buy Box Price'] = keepa.sellPrice
                    rows[i]['Badge'] = keepa.hasBadge
                    rows[i]['Net'] = keepa.profit
                    rows[i]['Category'] = keepa.category
                    rows[i]['ROI'] = keepa.roi
                    rows[i]['BSR'] = keepa.bsr
                    rows[i]['Amazon IMG'] = keepa.image

                    if (keepa?.hasBadge) {
                        // rows[i]['Date'] = this.currentDate()
                        rows[i]['Date'] = this.dateSave
                    }
                }

                /*if (!store.productIsExist()) {
                    rows[i]['Category'] = "Not Exist"
                }*/

                rows[i]['Source'] = store.getDomain()

                // rows[i]['Image'] = `=I${i+2}`
                rows[i]['Source URL'] = store.getUrl()
                rows[i]['IN Stock'] = store.isAvailability() ? "TRUE": "FALSE"
                rows[i]['Source Price'] = store.getPrice()
                await rows[i].save()

            } catch (e: any) {
                console.log(e.message)
                continue
            }
        }
    }
}