import SourceSiteFactory from './stores/SourceSiteFactory'
import { MyPuppeteer } from './lib/MyPuppeteer'
import WebScrapingApi from './lib/WebScrapingApi'
// @ts-ignore
import request from 'postman-request'
import cheerio from 'cheerio'

export async function main() {
    try {
        /*const proxyRequest = request.defaults({
            proxy: 'http://d8fdd1a5127c40049468dafcf932af8c:@proxy.crawlera.com:8011',
        })

        const options = {
            url: 'https://www.walmart.com/ip/seort/155974167',
            requestCert: true,
            rejectUnauthorized: false,
        }

        proxyRequest(options, callback)*/
        /*const $ = cheerio.load(result)

        console.log($('h1[itemprop="name"]'))*/

        const store = await SourceSiteFactory.create('https://www.walmart.com/ip/seort/155974167')

        await store.createBrowser()
        await store.scrape()
        store.productIsExist() ? console.log('Product Exist!') : console.log('Product Not Exist!')
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
    } catch (e: any) {
        console.log(e.message)
    }
}

function callback(error: any, response: any, body: any) {
    if (!error && response.statusCode == 200) {
        console.log(response.headers)
        console.log(body)
        const $ = cheerio.load(body)

        console.log($('h1[itemprop="name"]').text())
    } else {
        console.log(error, response, body)
    }
}

main()
