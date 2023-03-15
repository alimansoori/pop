import Store from '../../Store'

export default class Rockler extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product h1[class="page-title"] > span[data-ui-id="page-title-wrapper"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
