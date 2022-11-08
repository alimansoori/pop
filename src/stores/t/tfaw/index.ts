import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'

export default class Tfaw extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('h1.page-title > span[data-ui-id="page-title-wrapper"]')
        } catch (e) {
            this.productExist = false
        }
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="product-addtocart-button"]',
            render: null,
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '[data-price-type="finalPrice"]',
            render: 'data-price-amount',
        })
    }
}
