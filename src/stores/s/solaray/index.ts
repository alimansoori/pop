import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Solaray extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product__title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span.price-item--regular',
            render: 'text',
        })
    }
}
