import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Rockler extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product h1[class="page-title"] > span[data-ui-id="page-title-wrapper"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
