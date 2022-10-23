import Store from '../../Store'
import { Page, Browser } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Scheels extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button#add-to-cart:not([disabled="disabled"])', { timeout: 10000 })
            const availability = await this.page.$eval('button#add-to-cart:not([disabled="disabled"])', (elem) =>
                elem.getAttribute('value')
            )

            if (availability === 'Ship It') {
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
            await this.page.waitForSelector('div#product-content span[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('div#product-content span[itemprop="price"]', (elem) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
