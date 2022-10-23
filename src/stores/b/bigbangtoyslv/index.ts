import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Bigbangtoyslv extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[itemprop="availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('meta[itemprop="availability"]', (elem) =>
                elem.getAttribute('content')
            )

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
            await this.page.waitForSelector('meta[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('meta[itemprop="price"]', (elem) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
