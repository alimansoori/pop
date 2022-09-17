import Store from '../../Store'
import { Page } from 'puppeteer'

export default class Vitaminshoppe extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
        // this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
