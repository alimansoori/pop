import SourceSiteFactory from './stores/SourceSiteFactory'
// @ts-ignore
import request from 'postman-request'

export async function main() {
    try {
        /*const doc = new Doc()
        await doc.auth()*/
        /*const res = await MyPostmanRequest.request(
            'https://www.bhphotovideo.com/c/product/1507458-REG/ilford_1179585_multigrade_rc_deluxe_paper.html'
        )*/
        // console.log(res)

        const store = await SourceSiteFactory.create(
            'https://www.gamestop.com/toys-games/trading-cards/products/pokemon-battle-academy-trading-card-game/323895.html?utm_source=google&utm_medium=feeds&utm_campaign=%24PLA_%24NB_MNFR_Toys+%26+Collectibles_Pokemon&utm_id=16244983647&gclid=Cj0KCQjwxb2XBhDBARIsAOjDZ340fUmcvtEBVkmUZMvdHh2MUpikyHtv-05rLxtcb09O0kBm9oaPpscaAtkEEALw_wcB&gclsrc=aw.ds'
        )

        await store.createBrowser()
        await store.scrape()
        console.log('Error: ' + store.error)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
        await store.browser?.close()

        /*const keepa = new Keepa({
            asin: 'B086763VT8',
            sourcePrice: 22.04,
        })
        await keepa.fetchByKeepa()
        console.log(keepa.sellPrice)
        console.log(keepa.avgBuyBox30Day)
        console.log(keepa.size)
        console.log(keepa?.hasBadge)
        console.log(keepa.buyBoxIsAmazon)*/
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
