import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-25-2023
export default class Zerbee extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        // this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
