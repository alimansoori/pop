import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'

export default class K9cuisine extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div[title="Availability"] > span', { timeout: 10000 })
            const availability = await this.page.$eval(
                'div[title="Availability"] > span',
                (elem: any) => elem.textContent
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
            await this.page.waitForSelector('span[data-price-type="finalPrice"]', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval('span[data-price-type="finalPrice"]', (elem: any) =>
                    elem.getAttribute('data-price-amount')
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
