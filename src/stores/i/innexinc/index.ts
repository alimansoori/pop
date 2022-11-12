import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'

export default class Innexinc extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[class="product-name"] h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="product-addtocart-button"] > span > span',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"]',
            render: 'content',
        })
    }
}
