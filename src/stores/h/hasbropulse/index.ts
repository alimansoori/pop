import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

import { textToNumber } from '../../../lib/helper'

export default class Hasbropulse extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector(' button.product-form__add-to-cart > span > span', { timeout: 10000 })
            const availability = await this.page.$eval(
                ' button.product-form__add-to-cart > span > span',
                (elem) => elem.textContent
            )

            if (availability?.toLowerCase().includes('add to cart')) {
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
            await this.page.waitForSelector(' button.product-form__add-to-cart span[js-product-form="price"]', {
                timeout: 3000,
            })
            const price = textToNumber(
                await this.page.$eval(
                    ' button.product-form__add-to-cart span[js-product-form="price"]',
                    (elem) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
