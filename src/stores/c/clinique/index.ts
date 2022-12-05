import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Clinique extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.elc-product-full h1[data-test-id="product_name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
