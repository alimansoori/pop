import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Burkesoutlet extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.holder-tighter > div.info-box.ribbon.black', { timeout: 10000 })
            const availability = await this.page.$eval(
                'div.holder-tighter > div.info-box.ribbon.black',
                (elem: any) => elem.textContent
            )

            if (availability?.toLowerCase() === 'sold out') {
                this.setAvailability(false)
            } else {
                this.setAvailability(true)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span#price', { timeout: 3000 })
            const price = textToNumber(await this.page.$eval('span#price', (elem: any) => elem.textContent))

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
