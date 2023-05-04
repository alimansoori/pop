import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Etundra extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.product-info meta[itemprop="availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.product-info span[itemprop="price"]',
            render: 'content',
        })
    }
}
