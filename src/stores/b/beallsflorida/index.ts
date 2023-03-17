import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Beallsflorida extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-name')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="add2CartBtn"]:not(.disabled)',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span[id^="offerPrice"].price.pdp',
            render: 'text',
        })
    }
}
