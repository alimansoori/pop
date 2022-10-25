import Store from '../../Store'
import { Page, Browser } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Shopdisney extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            if (this.resultReq.error) return

            const availability = this.resultReq.$('*[itemprop="availability"]').text()

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
            if (this.resultReq.error) return
            const price = textToNumber(this.resultReq.$('*[itemprop="price"]').text())

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
