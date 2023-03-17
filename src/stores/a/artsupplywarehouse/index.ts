import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Artsupplywarehouse extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[class="product_detail_solo_page"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="text/ld+json"]')
    }
}
