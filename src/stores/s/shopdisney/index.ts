import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Shopdisney extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            let availability = ''
            const selector = '*[itemprop="availability"]'
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
            const selector = '*[itemprop="price"]'
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
