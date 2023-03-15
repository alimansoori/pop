import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-21-2023
export default class Christianbook extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.CBD-ProductDetailTitle')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
