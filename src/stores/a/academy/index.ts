import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Academy extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async productTitleCalculate(): Promise<void> {
        // this.titleClass.setTitle("ffff");
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
