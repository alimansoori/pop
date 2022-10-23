import Store from '../../Store'
import { Page, Browser } from 'puppeteer'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Nextwarehouse extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
