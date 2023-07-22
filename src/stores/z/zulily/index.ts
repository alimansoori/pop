import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Zulily extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('script.structured-data[type="application/ld+json"]')
        await this.pageNotFoundSelector('div[id="homepage_header_row"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
