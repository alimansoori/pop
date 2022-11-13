import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Fugitivetoys extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="product-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
