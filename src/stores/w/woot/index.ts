import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Woot extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('link[itemprop="availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('link[itemprop="availability"]', (elem: any) =>
                elem.getAttribute('href')
            )

            if (availability?.toLowerCase().includes('instock')) {
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
            const price = textToNumber(await this.page.$eval('*[itemprop="price"]', (elem: any) => elem.textContent))

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
