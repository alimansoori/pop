import SourceSiteFactory from './stores/SourceSiteFactory'
import Keepa from './lib/Keepa'

export async function main() {
    try {
        /*const includeAssets = [
            /https:\/\/assets.thdstatic.com\/analytics\//,
            'https://assets.thdstatic.com/analytics/sync/b2c/desktop/prod/current/sync.js',
            'https://assets.thdstatic.com/analytics/core/b2c/desktop/prod/current/core.js',
        ]
        const str = 'https://assets.thdstatic.com/analytics/core/b2c/desktop/prod/current/core.js'
        for (const patternAsset of includeAssets) {
            if (str.match(patternAsset)) {
                console.log('is match')
            }
        }*/
        /*const doc = new Doc('1')
        await doc.auth()*/

        /*const resultReq = await MyPostmanRequest.request(
            'https://www.walmart.com/ip/Funko-POP-TV-Stranger-Things-S3-W2-Eleven/453383678',
            true
        )
        console.log(resultReq.$('h1[itemprop="name"]').text())*/

        await sourceCheck({
            url: 'https://www.cvs.com/shop/phillips-milk-of-magnesia-overnight-relief-of-occasional-constipation-liquid-laxative-fresh-mint-prodid-811162',
        })

        /*await keepaCheck({
            asin: 'B09F3XP7FP',
            price: sourcePrice,
        })*/
    } catch (e: any) {
        console.log(e.message)
    }
}

async function sourceCheck(input: { url: string }): Promise<number> {
    let price = NaN
    try {
        const store = await SourceSiteFactory.create(input.url)
        await store.createBrowser(false)
        await store.scrape(false)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Title is: ' + store.getTitleClass().getTitle())
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source Image is: ' + store.getImage())
        console.log('Source is in stock: ' + store.isAvailability())
        console.log('ERROR msg: ' + store.error)
        price = store.getPrice()
        await store.browser?.close()
    } catch (e: any) {
        console.log(e.message)
    }

    return price
}

async function keepaCheck(input: { asin: string; price: number }) {
    try {
        const keepa = new Keepa({
            asin: input.asin,
            sourcePrice: input.price,
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
