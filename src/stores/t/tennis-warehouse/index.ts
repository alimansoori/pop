import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class TennisWarehouse extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1[itemprop="name"]',
            render: 'text',
        })

        // UPC
        try {
            await this.page.waitForSelector('meta[itemprop="gtin13"]', { timeout: 10000 })
            const upc = await this.page.$eval('meta[itemprop="gtin13"]', (elem: any) => elem.getAttribute('content'))
            this.setUPC(upc)
        } catch (e: any) {
            console.error(e.message)
        }
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'img[itemprop="image"]',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'meta[itemprop="availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[itemprop="price"]',
            render: 'content',
        })
    }
}
