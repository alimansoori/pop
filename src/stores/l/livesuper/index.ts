import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Livesuper extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div:not(.jss342) > button[data-test-id="atlas-button"] > span > span', {
                timeout: 10000,
            })
            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('[data-test-id="product-price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('[data-test-id="product-price"]', (elem) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
