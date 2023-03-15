import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Homedepot extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-details__badge-title--wrapper h1')
        // this.productExist = this.isSecond
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
