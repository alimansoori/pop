import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Abbottstore extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('p#stock-status', { timeout: 10000 })
            const availability = await this.page.$eval('p#stock-status', (elem: any) => elem.textContent)

            if (availability?.toLowerCase() === 'in stock') {
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
            await this.page.waitForSelector('span[id="current-price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('span[id="current-price"]', (elem: any) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
