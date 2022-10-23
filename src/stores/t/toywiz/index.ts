import Store from '../../Store'
import { Page, Browser } from 'puppeteer'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Toywiz extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="application/ld+json"]', { timeout: 10000 })
            this.productExist = true
        } catch (e: any) {
            this.productExist = false
        }
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
