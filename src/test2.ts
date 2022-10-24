import SourceSiteFactory from './stores/SourceSiteFactory'
import { MyPuppeteer } from './lib/MyPuppeteer'
import WebScrapingApi from './lib/WebScrapingApi'
// @ts-ignore
import request from 'postman-request'
import MyPostmanRequest from './lib/MyPostmanRequest'

export async function main() {
    try {
        /*const res = await MyPostmanRequest.request(
            'https://www.entertainmentearth.com/product/harry-potter-remus-lupin-pop-vinyl-figure-45/fu14939',
            true
        )
        console.log(res)*/

        const store = await SourceSiteFactory.create(
            'https://www.gamestop.com/collectibles/statues/products/qmx-spider-man-spider-cam-5-in-statue/156665.html'
        )

        await store.createBrowser()
        await store.scrape()
        store.productIsExist() ? console.log('Product Exist!') : console.log('Product Not Exist!')
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
