import Store from '../../Store'
import { textToNumber } from '../../../lib/helper'

export default class Chewy extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-testid="product-title-heading"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div[data-testid="buybox"] span.kib-button-default__label',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div#pricing p.price span.ga-eec__price, div[data-testid="advertised-price"]',
            render: 'text',
        })
    }
}
