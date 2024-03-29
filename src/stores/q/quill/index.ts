import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Quill extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.skuName')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[id="dvSkuPage"] div.pricing-wrap span.price-size',
            render: 'text',
        })
    }
}
