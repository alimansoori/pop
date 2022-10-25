import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Aaatoysandcollectibles extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[id="AddToCartText"]', { timeout: 10000 })
            const availability = await this.page.$eval('span[id="AddToCartText"]', (elem: any) => elem.textContent)

            if (availability === 'Add to Cart') {
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
            await this.page.waitForSelector('meta[property="og:price:amount"]', { timeout: 5000 })
            const price = textToNumber(
                await this.page.$eval('meta[property="og:price:amount"]', (elem: any) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
