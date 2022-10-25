import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Healthypets extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div[class="availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('div[class="availability"]', (elem: any) => elem.textContent)

            if (availability?.toLowerCase()?.includes('in stock')) {
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
            await this.page.waitForSelector('span[class="sale-price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('span[class="sale-price"]', (elem: any) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
