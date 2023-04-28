import SourceSiteFactory from './stores/SourceSiteFactory'
import Keepa from './lib/Keepa'
import { DbApi } from './lib/db-api/DbApi'

export async function main() {
    try {
        const dbApi = new DbApi('http://199.244.49.112:8080/api', '')
        /*console.log(
            await dbApi.addProduct({
                title: 'Transformers Takara Tomy Masterpiece Optimus Prime and Tenseg Base',
                link: 'https://hasbropulse.com/collections/all-products/products/transformers-takara-tomy-masterpiece-optimus-prime-and-tenseg-base',
            })
        )*/

        console.log(
            await dbApi.getProductByTitle({
                search: 'Disney Pop! Vinyl Figure Maleficent (Flames)',
            })
        )
        /*const input = [
            { images: '', 'images-src': '1.jpg' },
            { images: '', 'images-src': '2.jpg' },
        ]
        const output = input.map((obj) => obj['images-src'])
        console.log(JSON.stringify(output))*/

        /*const sourcePrice = await sourceCheck({
            url: 'https://www.anntaylor.com/work/all-work/cat4190020/608306.html?priceSort=DES',
        })*/

        /*await keepaCheck({
            asin: 'B09F3XP7FP',
            price: 2,
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
