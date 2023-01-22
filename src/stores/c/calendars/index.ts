import Store from '../../Store'

// 1-21-2023
export default class Calendars extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-wrapper h1.mz-pdp-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
