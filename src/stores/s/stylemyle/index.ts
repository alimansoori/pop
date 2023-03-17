import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Stylemyle extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product_desc h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="add-to-cart-button"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'h2[id="displayed_price"]',
            render: 'text',
        })
    }
}
