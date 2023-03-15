import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-27-2023
export default class Advanceautoparts extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h2.css-1vorsr4')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
