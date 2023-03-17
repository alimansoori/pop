import Store from '../../Store'

export default class Altomusic extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector(
            'div[class="product-info-main"] h1[class="page-title"] >span[data-ui-id="page-title-wrapper"]'
        )
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
