import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Beautance extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span.availability', { timeout: 10000 })
            const availability = await this.page.$eval('span.availability', (elem) => elem.textContent)

            if (
                availability?.toLowerCase().includes('instock') ||
                availability?.toLowerCase().includes('in stock') ||
                availability?.toLowerCase().includes('available')
            ) {
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
            await this.page.waitForSelector('span[id="our_price_display"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('span[id="our_price_display"]', (elem) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
