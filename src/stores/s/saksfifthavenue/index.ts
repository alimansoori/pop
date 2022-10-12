import Store from '../../Store'
import { Page } from 'puppeteer'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Saksfifthavenue extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async productTitleCalculate(): Promise<void> {
        // this.titleClass.setTitle("ffff");
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.prices-add-to-cart-actions button.add-to-cart', { timeout: 10000 })
            const availability = await this.page.$eval(
                'div.prices-add-to-cart-actions button.add-to-cart',
                (elem) => elem.textContent
            )

            if (
                availability?.toLowerCase().includes('add to bag') ||
                availability?.toLowerCase().includes('add to cart')
            ) {
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
