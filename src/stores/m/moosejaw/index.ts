import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Moosejaw extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('a[id="add2CartBtn"]', { timeout: 10000 })
            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector(
                'span.price-set > span.price-option, span[id="innerPrice"] > span.price-set-updated',
                { timeout: 3000 }
            )
            const price = textToNumber(
                await this.page.$eval(
                    'span.price-set > span.price-option, span[id="innerPrice"] > span.price-set-updated',
                    (elem) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
