import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Farmandfleet extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.siteIsBlocked = true
        // this.runPostman = true
        // this.viewPageSource = false
    }

    async productExistCalculate(): Promise<void> {
        this.productExist = false
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
