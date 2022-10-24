import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Booksamillion extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.siteIsBlocked = true
        this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[property="product:availability"]', { timeout: 10000 })
            const availability = await this.page.$eval('meta[property="product:availability"]', (elem) =>
                elem.getAttribute('content')
            )

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
            await this.page.waitForSelector('meta[property="product:price:amount"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('meta[property="product:price:amount"]', (elem) => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
