import SourceSiteFactory from './stores/SourceSiteFactory'
import Keepa from './lib/Keepa'
import { StoreOutputType } from './@types/StoreOutputType'
import ProfitRoiCalculate from './lib/ProfitRoiCalculate'
import DatabaseLeads from './sheets/DatabaseLeads'

export async function main() {
    try {
        const lead = new ProfitRoiCalculate({
            category: 'Toys & Games',
            sellPrice: 37,
            buyCost: 33.39,
            packageLength: 159,
            packageWidth: 89,
            packageHeight: 117,
            packageWeight: 113,
        })
        console.log(lead.netProfit)
        console.log(lead.roi)
        /*await sourceCheck({
            url: 'https://www.tcgplayer.com/product/242808/pokemon-celebrations-celebrations-collection-lances-charizard-v?country=US&utm_campaign=9549531350&utm_source=google&utm_medium=cpc&utm_content=422888779645&utm_term=&adgroupid=103661046211&gclid=CjwKCAjwi8iXBhBeEiwAKbUofU68zOTx4dFPlFJjqFUibruaDG0Z13SjImGsE3GnLI6oh9Es5dOdSBoCPQkQAvD_BwE&Language=English',
        })*/
        /*await keepaCheck({
            asin: 'B077J2GJBV',
            price: 31.74,
        })*/
        /*const google = new Google({
            title: 'Rule One Proteins, R1 Pre Amino – Peach Mango, Anytime Energy Boost, Amino Acid Complex, Caffeine from Green Tea and Coffee Extracts, Energy, Endurance, Focus Support, 30 Servings',
        })
        await google.search2()
        console.log(google.getAsins())*/
    } catch (e: any) {
        console.log(e.message)
    }
}

/*async function testSheet() {
    try {
        const leads = new GoogleSpreadsheet(CategorySheet.selectSheetKey('leads'))

        await leads.useServiceAccountAuth({
            // env var values are copied from service account credentials generated by google
            // see "Authentication" section in docs for more info
            client_email: keys.client_email,
            private_key: keys.private_key,
        })

        await leads.loadInfo()
        const dataBaseLeads = await leads.sheetsByTitle.data

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
        ])

        const rows = await dataBaseLeads.getRows()
        console.log(rows.length) // 2
        console.log(rows[0].Asin) // 'Larry Page'
        console.log(rows[0].Source) // 'larry@google.com'
        console.log(rows[0].Amazon_Number) // 'larry@google.com'

        // make updates
        // rows[1].email = 'sergey@abc.xyz';
        console.log(await rows[1].save()) // save changes

        // const sundar = await dataBaseLeads.addRow({ Asin: 'Sundar Pichai', Source: 'sundar@abc.xyz' })
        // console.log(sundar)
    } catch (e: any) {
        console.log(e.message)
    }
}*/

export async function sourceCheck(input: { url: string }): Promise<StoreOutputType> {
    try {
        const store = await SourceSiteFactory.create(input.url)
        await store.createBrowser(false)
        await store.scrape(false)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Title is: ' + store.getTitleClass().getTitle())
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source UPC is: ' + store.getUPC())
        console.log('Source Image is =>')
        console.log(store.getImage())
        console.log('Source is in stock: ' + store.isAvailability())
        console.log('ERROR msg: ' + store.error)
        await store.browser?.close()
        return {
            title: store.getTitleClass().getTitle(),
            statusCode: store.statusCode,
            images: store.getImage(),
            price: store.getPrice(),
            error: store.error,
        }
    } catch (e: any) {
        return {
            error: e.message,
        }
    }
}

export async function keepaCheck(input: { asin: string; price: number }) {
    try {
        const keepa = new Keepa({
            asin: input.asin,
            sourcePrice: input.price,
            configPath: './config.json',
        })
        await keepa.fetchByKeepa()
        console.log('Selling Price: ' + keepa.sellPrice)
        console.log('FBA Price: ' + keepa.fbaPrice)
        console.log('Brand: ' + keepa.brand)
        console.log('Profit: ' + keepa.profit)
        console.log('ROI: ' + keepa.roi)
        console.log('BSR: ' + keepa.bsr)
        console.log('TOP: ' + keepa.top)
        console.log('Seller: ' + (keepa.buyBoxIsAmazon ? 'Amazon' : ''))
        console.log('Category: ' + keepa.category)
        console.log('Has Badge: ' + keepa?.hasBadge)
        console.log('Buy Box is Amazon: ' + keepa.buyBoxIsAmazon)

        if (keepa?.hasBadge && !keepa.buyBoxIsAmazon) {
            console.log('< ADDED >')
        } else {
            console.log('< REJECT >')
        }
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
