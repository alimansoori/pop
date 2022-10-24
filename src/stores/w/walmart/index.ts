import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Walmart extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.siteIsBlocked = true
        this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {
        const canonical = this.resultReq.$('link[rel="canonical"]').attr('href')
        if (!this.resultReq.error && canonical) {
            this.url = canonical
        }
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
