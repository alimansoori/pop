import SourceSiteFactory from './stores/SourceSiteFactory'
import Keepa from './lib/Keepa'
import { StoreOutputType } from './@types/StoreOutputType'

export async function main() {
    try {
        // const dbApi = new DbApi('http://199.244.49.112:8080/api', '')
        /*console.log(
            await dbApi.addProduct({
                title: 'Transformers Takara Tomy Masterpiece Optimus Prime and Tenseg Base',
                link: 'https://hasbropulse.com/collections/all-products/products/transformers-takara-tomy-masterpiece-optimus-prime-and-tenseg-base',
            })
        )*/

        /*console.log(
            await dbApi.getProductByTitle({
                search: 'Blue Buffalo',
            })
        )*/
        /*const input = [
            { images: '', 'images-src': '1.jpg' },
            { images: '', 'images-src': '2.jpg' },
        ]
        const output = input.map((obj) => obj['images-src'])
        console.log(JSON.stringify(output))*/

        const storeRes = await sourceCheck({
            url: 'https://bicyclewarehouse.com/products/sram-gx-eagle-12-speed-chain',
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
        // await store.browser?.close()
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
