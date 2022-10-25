import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Boscovs extends Store {
    constructor(url: string) {
        super(url)

        // this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="add-to-cart"]:not(.button_disabled)', { timeout: 10000 })
            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('*[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(await this.page.$eval('*[itemprop="price"]', (elem: any) => elem.textContent))

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
