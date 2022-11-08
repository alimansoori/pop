import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Quill extends Store {
    constructor(url: string) {
        super(url)
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="skuName"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'a[id="myAddToCart_sku"] > span',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.sku-details-wrap span[id="SkuPriceUpdate"]',
            render: 'content',
        })
    }
}
