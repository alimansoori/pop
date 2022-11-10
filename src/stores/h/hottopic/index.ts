import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Hottopic extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="product-name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.availability-msg-text.instock',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.product-detail div.pdp-details div.price *.default-price *.value',
            render: 'content',
        })
    }
}
