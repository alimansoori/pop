import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Bestbuy extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[data-button-state="ADD_TO_CART"]', { timeout: 10000 })
            const availability = await this.page.$eval(
                'button[data-button-state="ADD_TO_CART"]',
                (elem: any) => elem.textContent
            )

            if (availability === 'Add to Cart') {
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
            await this.page.waitForSelector(
                'div[data-sticky-media-gallery="enabled"] div[class="priceView-hero-price priceView-customer-price"] > span[aria-hidden="true"]',
                { timeout: 5000 }
            )
            const price = textToNumber(
                await this.page.$eval(
                    'div[data-sticky-media-gallery="enabled"] div[class="priceView-hero-price priceView-customer-price"] > span[aria-hidden="true"]',
                    (elem: any) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
