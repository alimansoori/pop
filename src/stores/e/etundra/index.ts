import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Etundra extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.product-info meta[itemprop="availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('div.product-info meta[itemprop="availability"]', (elem: any) =>
                elem.getAttribute('content')
            )

            if (availability === 'http://schema.org/InStock') {
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
            await this.page.waitForSelector('div.product-info span[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('div.product-info span[itemprop="price"]', (elem: any) =>
                    elem.getAttribute('content')
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
