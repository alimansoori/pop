import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Orientaltrading extends Store {
    constructor(url: string) {
        super(url)

        // this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async productTitleCalculate(): Promise<void> {
        // this.titleClass.setTitle("ffff");
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('.u_txtPrice > span', { timeout: 3000 })
            const price = textToNumber(await this.page.$eval('.u_txtPrice > span', (elem: any) => elem.textContent))

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
