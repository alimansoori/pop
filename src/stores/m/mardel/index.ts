import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Mardel extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[itemprop="availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('span[itemprop="availability"]', (elem: any) =>
                elem.getAttribute('content')
            )

            if (availability === 'In stock') {
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
            await this.page.waitForSelector('span[class="current sale-price sale-price-copy"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval(
                    'span[class="current sale-price sale-price-copy"]',
                    (elem: any) => elem.textContent
                )
            )

            if (price) this.setPrice(price)
            else {
                await this.page.waitForSelector('span[class="current current-price-copy"]', { timeout: 3000 })
                const price2 = textToNumber(
                    await this.page.$eval('span[class="current current-price-copy"]', (elem: any) => elem.textContent)
                )
                this.setPrice(price2)
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
