import Store from '../../Store'
import { Page } from 'puppeteer'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Officedepot extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[data-auid="SkuPage_OdButton_BtnSidebarAddToCart"]', {
                timeout: 10000,
            })
            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
