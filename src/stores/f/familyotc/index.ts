import Store from '../../Store'
import {EnumLoadType} from '../../../@types/EnumLoadType'
import {EnumSelectorOrContent} from "../../../@types/EnumSelectorOrContent";

export default class Familyotc extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product_title')
        await this.pageNotFoundSelector('*.error-404', EnumSelectorOrContent.SELECTOR)
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
