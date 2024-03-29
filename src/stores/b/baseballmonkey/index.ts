import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Baseballmonkey extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector(
            'div[class="product-info-main"] h1[class="page-title"] > span[data-ui-id="page-title-wrapper"]'
        )
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
