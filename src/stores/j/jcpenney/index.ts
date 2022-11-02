import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Jcpenney extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[data-automation-id="addToCart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[data-automation-id="product-content-block"] *[data-automation-id="finalPriceAfterCoupon"]',
            selector2: 'div[data-automation-id="product-content-block"] *[data-automation-id="at-price-value"]',
            render: 'text',
        })
    }
}
