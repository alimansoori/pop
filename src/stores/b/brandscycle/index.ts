import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Brandscycle extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-ui="product-information-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
