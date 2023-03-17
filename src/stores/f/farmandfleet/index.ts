import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Farmandfleet extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        this.productExist = false
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
