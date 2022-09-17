import { myPage } from './lib/MyPage'
import SourceSiteFactory from './stores/SourceSiteFactory'

export async function main() {
    try {
        const page = await myPage()
        const store = await SourceSiteFactory.create(page, 'https://www.crystalclassics.com/lenox/877766L.htm')

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
