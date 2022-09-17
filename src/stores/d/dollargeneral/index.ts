import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Dollargeneral extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[class="product__online-stock"]', { timeout: 10000 })
            const availability = await this.page.$eval(
                'span[class="product__online-stock"]',
                (elem) => elem.textContent
            )

            if (availability?.toLowerCase() === 'in stock online') {
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
            await this.page.waitForSelector('span[class="product-price"]', { timeout: 3000 })
            const price = textToNumber(await this.page.$eval('span[class="product-price"]', (elem) => elem.textContent))

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
