import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Quill extends Store {
    constructor(url: string) {
        super(url)
        this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.sku-details-wrap span[id="SkuPriceUpdate"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('div.sku-details-wrap span[id="SkuPriceUpdate"]', (elem: any) =>
                    elem.getAttribute('content')
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
