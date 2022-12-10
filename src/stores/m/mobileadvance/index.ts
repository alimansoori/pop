import Store from '../../Store'

import { click } from '../../../lib/helper'
import sleep from '../../../utils/sleep'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Mobileadvance extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'meta[property="og:availability"]',
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
