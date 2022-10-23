import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

import { textToNumber } from '../../../lib/helper'

export default class Hobbylobby extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="addToCartButton"]', { timeout: 10000 })
            const availability = await this.page.$eval('button[id="addToCartButton"]', (elem) =>
                elem.getAttribute('id')
            )

            if (availability === 'addToCartButton') {
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
                await this.page.$eval('span[class="current sale-price sale-price-copy"]', (elem) => elem.textContent)
            )

            if (price) this.setPrice(price)
            else {
                await this.page.waitForSelector('span[class="current current-price-copy"]', { timeout: 3000 })
                const price2 = textToNumber(
                    await this.page.$eval('span[class="current current-price-copy"]', (elem) => elem.textContent)
                )
                this.setPrice(price2)
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
