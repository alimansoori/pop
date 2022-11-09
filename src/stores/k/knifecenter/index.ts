import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Knifecenter extends Store {
    constructor(url: string) {
        super(url)
        // this.siteIsBlocked = true
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="product"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            let availability = ''
            const selector = 'a.instock'
            if (this.runPostman) {
                availability = this.resultReq.$(selector).text()
            } else {
                await this.page.waitForSelector(selector, { timeout: 10000 })
                availability = await this.page.$eval(selector, (elem: any) => elem.textContent)
            }

            if (availability?.toLowerCase().includes('instock') || availability?.toLowerCase().includes('in stock')) {
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
            const selector = 'h2.price span:nth-child(2)'
            if (this.runPostman) {
                this.setPrice(textToNumber(this.resultReq.$(selector).text()))
            } else {
                await this.page.waitForSelector(selector, { timeout: 10000 })
                this.setPrice(await this.page.$eval(selector, (elem: any) => elem.textContent))
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
