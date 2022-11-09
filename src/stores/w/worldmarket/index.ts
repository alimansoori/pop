import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Worldmarket extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[class="ml-product-wrapper"] h1 > div[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
