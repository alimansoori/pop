import SourceSiteFactory from './stores/SourceSiteFactory'
import Keepa from './lib/Keepa'

export async function main() {
    try {
        /*const doc = new Doc('1')
        await doc.auth()*/

        await sourceCheck({
            url: 'https://www.play-asia.com/super-smash-bros-ultimate/13/70by0v',
        })

        /*await keepaCheck({
            asin: 'B07SR5L8G3',
            price: 98,
        })*/
    } catch (e: any) {
        console.log(e.message)
    }
}

async function sourceCheck(input: { url: string }) {
    try {
        const store = await SourceSiteFactory.create(input.url)
        await store.createBrowser()
        await store.scrape()
        console.log('Error: ' + store.error)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Title is: ' + store.getTitleClass().getTitle())
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source Image is: ' + store.getImage())
        console.log('Source is in stock: ' + store.isAvailability())
        await store.browser?.close()
    } catch (e: any) {
        console.log(e.message)
    }
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
