import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Walmart extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.siteIsBlocked = true
        this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {
        this.setCanonical()
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
