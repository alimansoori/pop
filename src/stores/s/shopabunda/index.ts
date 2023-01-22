import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-21-2023
export default class Shopabunda extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[id="productPrice"]',
            render: 'text',
        })
    }
}
