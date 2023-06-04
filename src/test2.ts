import SourceSiteFactory from './stores/SourceSiteFactory'
import Keepa from './lib/Keepa'
import { StoreOutputType } from './@types/StoreOutputType'

export async function main() {
    try {
        const storeRes = await sourceCheck({
            url: 'https://www.brandsmartusa.com/incipio/251149/duo-for-samsung-galaxy-s21-5g.htm',
        })
        /*await keepaCheck({
            asin: 'B00002N6T5',
            price: 5.1,
        })*/
    } catch (e: any) {
        console.log(e.message)
    }
}

export async function sourceCheck(input: { url: string }): Promise<StoreOutputType> {
    try {
        const store = await SourceSiteFactory.create(input.url)
        await store.createBrowser(false)
        await store.scrape(false)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Title is: ' + store.getTitleClass().getTitle())
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source UPC is: ' + store.getUPC())
        console.log('Source Image is =>')
        console.log(store.getImage())
        console.log('Source is in stock: ' + store.isAvailability())
        console.log('ERROR msg: ' + store.error)
        await store.browser?.close()
        return {
            title: store.getTitleClass().getTitle(),
            statusCode: store.statusCode,
            images: store.getImage(),
            price: store.getPrice(),
            error: store.error,
        }
    } catch (e: any) {
        return {
            error: e.message,
        }
    }
}

export async function keepaCheck(input: { asin: string; price: number }) {
    try {
        const keepa = new Keepa({
            asin: input.asin,
            sourcePrice: input.price,
            configPath: './config.json',
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
