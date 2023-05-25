import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bitsandpieces extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.mainprodname')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
