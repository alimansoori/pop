import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-21-2023
export default class Curlsmith extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-grid__content h1.product-single__title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
