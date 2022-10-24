import SourceSiteFactory from './stores/SourceSiteFactory'
import { MyPuppeteer } from './lib/MyPuppeteer'
import WebScrapingApi from './lib/WebScrapingApi'
// @ts-ignore
import request from 'postman-request'
import MyPostmanRequest from './lib/MyPostmanRequest'

export async function main() {
    try {
        const res = await MyPostmanRequest.request(
            'https://www.target.com/p/b-toys-toy-vet-kit-for-kids-critter-clinic/-/A-76155786'
        )
        console.log(res.$('h1[data-test="product-title"]').text())

        /*const store = await SourceSiteFactory.create('https://www.academy.com/p/schutt-youth-500-back-plate')

        await store.createBrowser()
        await store.scrape()
        store.productIsExist() ? console.log('Product Exist!') : console.log('Product Not Exist!')
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())*/
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
