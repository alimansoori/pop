import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-20-2022
export default class Focuscamera extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="product"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
