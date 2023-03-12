import Store from '../../Store'
import { textToNumber } from '../../../lib/helper'

export default class Keurig extends Store {
    constructor(url: string) {
        super(url)
        // this.siteIsBlocked = true
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            if (this.headlessRun) {
                const availability = this.resultReq.$('a[title="Add to Cart"]').text()
                if (availability?.toLowerCase().trim().includes('add to cart')) {
                    this.setAvailability(true)
                }
            } else {
                await this.page.waitForSelector('a[title="Add to Cart"]', { timeout: 10000 })
                const availability = await this.page.$eval('a[title="Add to Cart"]', (elem: any) => elem.textContent)

                if (availability?.toLowerCase().includes('add to cart')) {
                    this.setAvailability(true)
                } else {
                    this.setAvailability(false)
                }
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            if (this.headlessRun) {
                this.setPrice(textToNumber(this.resultReq.$('span.big-price').text()))
            } else {
                await this.page.waitForSelector('span.big-price', { timeout: 3000 })
                this.setPrice(textToNumber(await this.page.$eval('span.big-price', (elem: any) => elem.textContent)))
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
