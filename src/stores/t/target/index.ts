import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Target extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('h1[data-test="product-title"]', { timeout: 10000 })
        } catch (e: any) {
            this.productExist = false
        }
    }

    async availibilityCalculate(): Promise<void> {
        try {
            try {
                await this.page.waitForSelector('button[data-test="fulfillment-cell-shipping"]', { timeout: 10000 })
                await this.page.click('button[data-test="fulfillment-cell-shipping"]')
            } catch (e: any) {
                console.log(e.message)
            }

            await this.page.waitForSelector('button[data-test="shippingButton"]', { timeout: 10000 })

            const availability = await this.page.$eval('button[data-test="shippingButton"]', (elem) => elem.textContent)

            if (availability === 'Add to cart') {
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
            await this.page.waitForSelector('span[data-test="product-price"]', { timeout: 5000 })
            const price = textToNumber(
                await this.page.$eval('span[data-test="product-price"]', (elem) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
