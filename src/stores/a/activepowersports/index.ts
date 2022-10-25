import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Activepowersports extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        try {
            if (!this.resultReq.error) {
                const price = textToNumber(this.resultReq.$('div.productView-price *.price--withoutTax').text())
                this.setPrice(price)
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
