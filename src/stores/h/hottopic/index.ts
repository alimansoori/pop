import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Hottopic extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.availability-msg-text.instock', { timeout: 5000 })

            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
