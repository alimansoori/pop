import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Vitacost extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.pBuyMsgLive', { timeout: 10000 })
            const availability = await this.page.$eval('div.pBuyMsgLive', (elem: any) => elem.getAttribute('content'))

            if (availability?.toLowerCase().includes('in stock')) {
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
            await this.page.waitForSelector('li#pdpSubPrice *[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('li#pdpSubPrice *[itemprop="price"]', (elem: any) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
