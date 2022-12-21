import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Burkedecor extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-single__title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button.add-to-cart',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span.product__price',
            render: 'text',
        })
    }
}
