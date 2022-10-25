import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Petedge extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.stock-information-container > p[class^="stock-message"]', {
                timeout: 10000,
            })
            const availability = await this.page.$eval(
                'div.stock-information-container > p[class^="stock-message"]',
                (elem: any) => elem.textContent
            )

            if (availability === 'In Stock') {
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
            await this.page.waitForSelector('meta[property="product:price:amount"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('meta[property="product:price:amount"]', (elem: any) =>
                    elem.getAttribute('content')
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
