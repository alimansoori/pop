import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bigapplecollectibles extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas(
            'main[id="MainContent"] div[id="shopify-section-product-template"] script[type="application/ld+json"]'
        )
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas(
            'main[id="MainContent"] div[id="shopify-section-product-template"] script[type="application/ld+json"]'
        )
    }
}
