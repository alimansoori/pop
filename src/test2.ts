import SourceSiteFactory from './stores/SourceSiteFactory'
// @ts-ignore
import request from 'postman-request'
import Keepa from './lib/Keepa'

export async function main() {
    try {
        /*const res = await MyPostmanRequest.request(
            'https://www.bhphotovideo.com/c/product/1507458-REG/ilford_1179585_multigrade_rc_deluxe_paper.html'
        )*/
        // console.log(res)

        /*const store = await SourceSiteFactory.create(
            'https://www.walgreens.com/store/c/burt%27s-bees-pomegranate-seed-oil-very-volumizing-shampoo-with-pomegranate/ID=prod6099578-product'
        )

        await store.createBrowser()
        await store.scrape()
        store.productIsExist() ? console.log('Product Exist!') : console.log('Product Not Exist!')
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())*/

        const keepa = new Keepa({
            asin: 'B09B2P18GK',
            sourcePrice: 2,
        })
        await keepa.fetchByKeepa()
        console.log(keepa.sellPrice)
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
