import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'

export default class Miniaturemarket extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        if (this.resultReq.error) return
        const availability = this.resultReq.$('a[title="Add to Cart"]').text()
        if (availability?.toLowerCase().trim().includes('add to cart')) {
            this.setAvailability(true)
        }
    }

    async priceCalculate(): Promise<void> {
        if (this.resultReq.error) return
        const price = textToNumber(this.resultReq.$('*[class="special-price"] > span.price').text())

        this.setPrice(price)
    }
}
