import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Wheelparts4 extends Store {
    constructor(url: string) {
        super(url)
        // this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        // await this.productExistBySelector('')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[itemprop="availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('meta[itemprop="availability"]', (elem: any) =>
                elem.getAttribute('content')
            )

            if (
                availability?.toLowerCase() === 'instock' ||
                availability?.toLowerCase() === 'https://schema.org/instock'
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
            await this.page.waitForSelector('meta[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('meta[itemprop="price"]', (elem: any) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
