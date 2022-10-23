import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

export default class Dillards extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="add-to-bag"]', { timeout: 10000 })
            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
