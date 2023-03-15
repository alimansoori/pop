import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Vitaminlife extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
        // this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product_name')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
