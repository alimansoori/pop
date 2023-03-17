import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Nothingbutsavings extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-header div[id="desktop-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div[id="details-cart-button"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1:
                'div.product-container > div.product-right > div.product-details:first-child > div.product-dlist2-price',
            render: 'text',
        })
    }
}
