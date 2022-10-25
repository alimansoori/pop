import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'

export default class Toyarena extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.siteIsBlocked = true
        this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('[id="addToCartText-product-template"]', { timeout: 10000 })
            const availability = await this.page.$eval(
                '[id="addToCartText-product-template"]',
                (elem: any) => elem.textContent
            )

            if (availability?.toLowerCase().includes('add to cart')) {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('*[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('*[itemprop="price"]', (elem: any) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
