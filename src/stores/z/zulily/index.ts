import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-23-2023
export default class Zulily extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('script.structured-data[type="application/ld+json"]')
        // this.productExist = this.isSecond
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
