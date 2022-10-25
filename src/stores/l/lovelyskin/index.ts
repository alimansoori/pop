import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Lovelyskin extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('a[data-event-label="Add to Cart"]', { timeout: 10000 })
            const availability = await this.page.$eval(
                'a[data-event-label="Add to Cart"]',
                (elem: any) => elem.textContent
            )

            if (availability?.toLowerCase() === 'add to cart') {
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
            await this.page.waitForSelector('span.ls-price-xxlarge', { timeout: 3000 })
            const price = textToNumber(await this.page.$eval('span.ls-price-xxlarge', (elem: any) => elem.textContent))

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
