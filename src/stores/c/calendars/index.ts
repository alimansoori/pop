import Store from '../../Store'
import { Page, Browser } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Calendars extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('*.mz-product-qty-stock-value', { timeout: 10000 })
            const availability = await this.page.$eval('*.mz-product-qty-stock-value', (elem) => elem.textContent)

            if (availability?.toLowerCase().trim().includes('in stock')) {
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
            await this.page.waitForSelector('div#product-detail span[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('div#product-detail span[itemprop="price"]', (elem) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
