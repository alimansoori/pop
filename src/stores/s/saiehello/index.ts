import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Saiehello extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-template--details-content h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[property="og:price:amount"]',
            render: 'content',
        })
    }
}
