import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Activepowersports extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('*[itemprop="price"]', { timeout: 3000 })
            const price = textToNumber(await this.page.$eval('*[itemprop="price"]', (elem) => elem.textContent))
            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
