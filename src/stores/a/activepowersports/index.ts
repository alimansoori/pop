import Store from '../../Store'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Activepowersports extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        try {
            const selector = 'div.productView-price *.price--withoutTax'
            if (!this.headlessRun) {
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
