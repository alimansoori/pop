import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Shoplet extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.viewPageSource = false
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}