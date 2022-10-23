import SourceSiteFactory from './stores/SourceSiteFactory'
import { MyPuppeteer } from './lib/MyPuppeteer'
import WebScrapingApi from './lib/WebScrapingApi'

export async function main() {
    try {
        /*const webScrapingApi = new WebScrapingApi()
        await webScrapingApi.fetch('https://www.walmart.com/ip/seort/49058126')*/
        const pup = new MyPuppeteer()
        await pup.build()
        const page = pup.page
        const browser = pup.browser
        await page.goto('https://www.walmart.com/ip/seort/122721542', {
            waitUntil: 'load',
            timeout: 180000,
        })

        /*const store = await SourceSiteFactory.create(page, 'https://www.walmart.com/ip/seort/155974167')

        await store.scrape()
        store.productIsExist() ? console.log('Product Exist!') : console.log('Product Not Exist!')
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())*/
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
