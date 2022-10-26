import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Quill extends Store {
    constructor(url: string) {
        super(url)
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        try {
            const selector = 'div.sku-details-wrap span[id="SkuPriceUpdate"]'
            if (this.runPostman) {
                this.setPrice(textToNumber(this.resultReq.$(selector).text()))
            } else {
                await this.page.waitForSelector(selector, { timeout: 10000 })
                this.setPrice(await this.page.$eval(selector, (elem: any) => elem.getAttribute('content')))
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
