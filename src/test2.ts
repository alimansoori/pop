import SourceSiteFactory from './stores/SourceSiteFactory'
// @ts-ignore
import request from 'postman-request'
import Keepa from './lib/Keepa'
import Doc from './sheets/Doc'

export async function main() {
    try {
        /*const doc = new Doc()
        await doc.auth()*/
        /*const res = await MyPostmanRequest.request(
            'https://www.bhphotovideo.com/c/product/1507458-REG/ilford_1179585_multigrade_rc_deluxe_paper.html'
        )*/
        // console.log(res)
        const store = await SourceSiteFactory.create('https://www.wdrake.com/buy-naxa-cd-player-367500')

        await store.createBrowser()
        await store.scrape()
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
        /*const keepa = new Keepa({
            asin: 'B09B2P18GK',
            sourcePrice: 2,
        })
        await keepa.fetchByKeepa()
        console.log(keepa.sellPrice)
        console.log(keepa.size)*/
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
