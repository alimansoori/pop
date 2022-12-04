import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Omegajuicers extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h2.product___title__part')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="AddToCart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[id="shopify-section-part-cart"] *[itemprop="price"]',
            render: 'content',
        })
    }
}
