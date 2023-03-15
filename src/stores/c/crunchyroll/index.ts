import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Crunchyroll extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-single__title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
