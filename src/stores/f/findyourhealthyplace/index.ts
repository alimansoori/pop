import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'

export default class Findyourhealthyplace extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product_title ')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'meta[property="product:availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[property="product:price:amount"]',
            render: 'content',
        })
    }
}