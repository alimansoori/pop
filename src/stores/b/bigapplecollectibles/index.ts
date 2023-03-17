import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bigapplecollectibles extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-single__title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas(
            'main[id="MainContent"] div[id="shopify-section-product-template"] script[type="application/ld+json"]'
        )
    }
}
