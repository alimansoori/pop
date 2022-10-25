import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Sierra extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[name="og:availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('meta[name="og:availability"]', (elem: any) =>
                elem.getAttribute('content')
            )

            if (availability === 'in stock') {
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
            await this.page.waitForSelector('meta[name="product:price:amount"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('meta[name="product:price:amount"]', (elem: any) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
