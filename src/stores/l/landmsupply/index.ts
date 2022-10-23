import Store from '../../Store'
import { Page, Browser } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Landmsupply extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.available > span', { timeout: 10000 })
            const availability = await this.page.$eval('div.available > span', (elem) => elem.textContent)

            console.log(availability)
            if (availability?.toLowerCase().includes('instock') || availability?.toLowerCase().includes('in stock')) {
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
            await this.page.waitForSelector('meta[property="product:price:amount"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('meta[property="product:price:amount"]', (elem) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
