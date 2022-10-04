import SourceSiteFactory from './stores/SourceSiteFactory'
import { MyPuppeteer } from './lib/MyPuppeteer'

export async function main() {
    try {
        const pup = new MyPuppeteer()
        await pup.build()
        const page = pup.page
        const store = await SourceSiteFactory.create(
            page,
            'https://www.walmart.com/ip/Aqueon-QuietFlow-LED-PRO-Aquarium-Power-Filter-75/242976367?wmlspartner=wlpa&selectedSellerId=101076093'
        )

        await store.scrape()
        store.productIsExist() ? console.log('Product Exist!') : console.log('Product Not Exist!')
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())

        /*const keepa = new Keepa({asin: "B09JHNMP9M", sourcePrice: 33.49})
await keepa.fetchByKeepa()
console.log(keepa.profit)
console.log(keepa.roi)*/
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
