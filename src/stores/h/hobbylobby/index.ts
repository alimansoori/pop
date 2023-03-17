import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Hobbylobby extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="addToCartButton"]',
            render: null,
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span[class="current sale-price sale-price-copy"]',
            selector2: 'span[class="current current-price-copy"]',
            render: 'text',
        })
    }
}
