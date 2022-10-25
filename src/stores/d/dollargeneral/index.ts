import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Dollargeneral extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[class="product__online-stock"]', { timeout: 10000 })
            const availability = await this.page.$eval(
                'span[class="product__online-stock"]',
                (elem: any) => elem.textContent
            )

            if (availability?.toLowerCase() === 'in stock online') {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[class="product-price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('span[class="product-price"]', (elem: any) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
