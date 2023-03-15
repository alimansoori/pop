import Store from '../../Store'

export default class Cyclegear extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
