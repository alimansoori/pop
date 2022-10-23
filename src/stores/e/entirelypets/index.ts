import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

export default class Entirelypets extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('input[id="vwd-add-to-cart"]', { timeout: 10000 })
            const availability = await this.page.$eval('input[id="vwd-add-to-cart"]', (elem) =>
                elem.getAttribute('value')
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
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
