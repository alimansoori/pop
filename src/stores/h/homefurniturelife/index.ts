import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Homefurniturelife extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[name="add-to-cart"]', { timeout: 10000 })
            const availability = await this.page.$eval('button[name="add-to-cart"]', (elem) =>
                elem.getAttribute('name')
            )

            if (availability === 'add-to-cart') {
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
            await this.page.waitForSelector('div.product-info div.price-wrapper span.woocommerce-Price-amount > bdi', {
                timeout: 5000,
            })
            const price = textToNumber(
                await this.page.$eval(
                    'div.product-info div.price-wrapper span.woocommerce-Price-amount > bdi',
                    (elem) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
