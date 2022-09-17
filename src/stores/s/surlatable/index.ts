import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Surlatable extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('fieldset button[id="add-to-cart"]:not([disabled="disabled"])', {
                timeout: 10000,
            })
            const availability = await this.page.$eval(
                'fieldset button[id="add-to-cart"]:not([disabled="disabled"])',
                (elem) => elem.textContent
            )

            if (availability?.toLowerCase() === 'add to cart') {
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
            await this.page.waitForSelector('div.sale-price > span.price, div.regular-price > span.price', {
                timeout: 3000,
            })
            const price = textToNumber(
                await this.page.$eval(
                    'div.sale-price > span.price, div.regular-price > span.price',
                    (elem) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
