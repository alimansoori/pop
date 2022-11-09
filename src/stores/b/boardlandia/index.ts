import Store from '../../Store'

export default class Boardlandia extends Store {
    constructor(url: string) {
        super(url)
        // this.runPostman = true
        // this.siteIsBlocked = true

        // this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="product-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
