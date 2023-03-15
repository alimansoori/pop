import Store from '../../Store'

export default class Boxed extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
        // this.siteIsBlocked = true
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('*[id="product-page"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
