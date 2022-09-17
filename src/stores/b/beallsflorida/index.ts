import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Beallsflorida extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="add2CartBtn"]:not(.disabled)', { timeout: 10000 })
            const availability = await this.page.$eval(
                'button[id="add2CartBtn"]:not(.disabled)',
                (elem) => elem.textContent
            )

            if (availability?.trim() === 'Add to Bag' || availability?.trim() === 'Add to Cart') {
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
            await this.page.waitForSelector('span[id^="offerPrice"].price.pdp', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('span[id^="offerPrice"].price.pdp', (elem) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
