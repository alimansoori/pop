import Store from '../../Store'

export default class Baseballmonkey extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector(
            'div[class="product-info-main"] h1[class="page-title"] > span[data-ui-id="page-title-wrapper"]'
        )
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
