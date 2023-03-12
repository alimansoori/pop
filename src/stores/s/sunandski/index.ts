import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Sunandski extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            let availability: string | undefined = ''
            const selector = '*[itemprop="availability"]'
            if (this.headlessRun) {
                availability = this.resultReq.$(selector).attr('content')
            } else {
                await this.page.waitForSelector(selector, { timeout: 10000 })
                availability = await this.page.$eval(selector, (elem: any) => elem.getAttribute('content'))
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
            if (this.headlessRun) {
                this.setPrice(textToNumber(this.resultReq.$(selector).attr('content')))
            } else {
                await this.page.waitForSelector(selector, { timeout: 10000 })
                this.setPrice(await this.page.$eval(selector, (elem: any) => elem.getAttribute('content')))
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
