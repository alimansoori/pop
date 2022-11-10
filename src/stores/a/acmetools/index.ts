import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Acmetools extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.siteIsBlocked = true
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-name')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[class="in-stock"] *[class="inventory-msg"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
