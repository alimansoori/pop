import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Mealeymarine extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        // this.siteIsBlocked = true
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {}

    async productTitleCalculate(): Promise<void> {
        // this.titleClass.setTitle("ffff");
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
