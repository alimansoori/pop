import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { EnumSelectorOrContent } from '../../../@types/EnumSelectorOrContent'

export default class Vitaminshoppe extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
        await this.pageNotFoundSelector('div.page-not-found h1.oops-text', EnumSelectorOrContent.SELECTOR)
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
