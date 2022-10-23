import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Belk extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('link[itemprop="availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('link[itemprop="availability"]', (elem) =>
                elem.getAttribute('href')
            )

            if (availability === 'http://schema.org/InStock' || availability === 'https://schema.org/InStock') {
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
            await this.page.waitForSelector('span[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(await this.page.$eval('span[itemprop="price"]', (elem) => elem.textContent))

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
