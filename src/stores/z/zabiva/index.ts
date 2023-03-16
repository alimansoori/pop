import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-20-2023
export default class Zabiva extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-title')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: '*[itemtype="http://schema.org/Product"] > meta[itemprop="name"]',
            render: 'content',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: '*[itemtype="http://schema.org/Product"] > *[itemprop="image"]',
            render: 'href',
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
