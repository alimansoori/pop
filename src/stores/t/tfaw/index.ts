import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'

export default class Tfaw extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="product-addtocart-button"]', { timeout: 10000 })
            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('[data-price-type="finalPrice"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('[data-price-type="finalPrice"]', (elem) =>
                    elem.getAttribute('data-price-amount')
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
