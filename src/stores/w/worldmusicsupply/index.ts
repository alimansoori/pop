import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Worldmusicsupply extends Store {
    constructor(url: string) {
        super(url)

        // this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('*.availability > span', { timeout: 10000 })
            const availability = await this.page.$eval('*.availability > span', (elem: any) => elem.textContent)

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
            await this.page.waitForSelector('*.special-price > *.price, *.regular-price > *.price', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval(
                    '*.special-price > *.price, *.regular-price > *.price',
                    (elem: any) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
