import Store from '../../Store'
import { Page } from 'puppeteer'

export default class Basspro extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {}

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="application/ld+json"]', { timeout: 10000 })
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
