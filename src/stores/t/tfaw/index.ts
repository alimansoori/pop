import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { EnumSelectorOrContent } from '../../../@types/EnumSelectorOrContent'

export default class Tfaw extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.page-title > span[data-ui-id="page-title-wrapper"]')
        await this.pageNotFoundSelector('The page you requested was not found, and we have a fine guess why.', EnumSelectorOrContent.CONTENT)
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
