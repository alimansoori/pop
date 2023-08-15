import Store from '../../Store'
import { EnumSelectorOrContent } from '../../../@types/EnumSelectorOrContent'

export default class Altomusic extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector(
            'div[class="product-info-main"] h1[class="page-title"] > span[data-ui-id="page-title-wrapper"]'
        )

        await this.pageNotFoundSelector('404 Error', EnumSelectorOrContent.CONTENT)
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
