import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

import { textToNumber } from '../../../lib/helper'

export default class Chewy extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div[data-testid="buybox"] span.kib-button-default__label', {
                timeout: 10000,
            })
            const availability = await this.page.$eval(
                'div[data-testid="buybox"] span.kib-button-default__label',
                (elem) => elem.textContent
            )

            if (availability === 'Add to Cart' || availability === 'Add to cart') {
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
                'div#pricing p.price span.ga-eec__price, div[data-testid="advertised-price"]',
                { timeout: 5000 }
            )
            const price = textToNumber(
                await this.page.$eval(
                    'div#pricing p.price span.ga-eec__price, div[data-testid="advertised-price"]',
                    (elem) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
