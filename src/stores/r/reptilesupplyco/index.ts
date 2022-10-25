import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Reptilesupplyco extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('p[id="add_to_cart"] > button > span', { timeout: 10000 })
            const availability = await this.page.$eval(
                'p[id="add_to_cart"] > button > span',
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
            await this.page.waitForSelector('span[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('span[itemprop="price"]', (elem: any) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
