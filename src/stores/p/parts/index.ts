import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Parts extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-detail h1')
    }

    async productTitleCalculate(): Promise<void> {
        // this.titleClass.setTitle("ffff");
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
