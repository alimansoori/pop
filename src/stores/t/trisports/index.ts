import Store from '../../Store'

export default class Trisports extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
