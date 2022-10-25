import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Atomicempire extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button.addtocart > span', { timeout: 10000 })
            const availability = await this.page.$eval('button.addtocart > span', (elem: any) => elem.textContent)

            if (availability?.toLowerCase().includes('add to cart')) {
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
            await this.page.waitForSelector('div.pricing >div.row > div:not(:first-child) > strong', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval(
                    'div.pricing >div.row > div:not(:first-child) > strong',
                    (elem: any) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
