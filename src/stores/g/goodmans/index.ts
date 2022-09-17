import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Goodmans extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div#itemCallToAction > div.h5', { timeout: 10000 })
            const availability = await this.page.$eval('div#itemCallToAction > div.h5', (elem) => elem.textContent)

            if (availability === 'In stock' || availability === 'In Stock') {
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
            await this.page.waitForSelector('div[id="itemPrice"]', { timeout: 7000 })
            const price = textToNumber(
                await this.page.$eval('div[id="itemPrice"]', (elem) => elem.getAttribute('data-base-price'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
