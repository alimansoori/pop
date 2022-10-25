import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Kikocosmetics extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button.Button--AddToCart > span.Label', { timeout: 10000 })
            const availability = await this.page.$eval(
                'button.Button--AddToCart > span.Label',
                (elem: any) => elem.textContent
            )

            if (
                availability?.toLowerCase().includes('add to cart') ||
                availability?.toLowerCase().includes('add to bag')
            ) {
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
            await this.page.waitForSelector('*[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('*[itemprop="price"]', (elem: any) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
