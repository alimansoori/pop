import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { EnumSelectorOrContent } from '../../../@types/EnumSelectorOrContent'

export default class Ibspot extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-details-title')
        await this.pageNotFoundSelector("we couldn't find that page", EnumSelectorOrContent.CONTENT)
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
