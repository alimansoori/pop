import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Nextwarehouse extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('script[type="application/ld+json"]')
    }

    async availibilityCalculate(): Promise<void> {
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
