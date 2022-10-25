import Store from '../../Store'
import { textToNumber } from '../../../lib/helper'

export default class Menards extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="addToCartButton"]', { timeout: 10000 })
            const availability = await this.page.$eval('button[id="addToCartButton"]', (elem: any) => elem.textContent)

            if (availability?.toLowerCase().includes('add to cart')) {
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
            await this.page.waitForSelector('span[id="itemFinalPrice"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('span[id="itemFinalPrice"]', (elem: any) => elem.getAttribute('data-final-price'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
