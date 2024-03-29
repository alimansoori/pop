import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bjs extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
        this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1 span[auto-data="product_name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[auto-data="product_price"]',
            render: 'text',
        })
    }
}
