import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'

export default class Surlatable extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('fieldset button[id="add-to-cart"]:not([disabled="disabled"])', {
                timeout: 10000,
            })
            const availability = await this.page.$eval(
                'fieldset button[id="add-to-cart"]:not([disabled="disabled"])',
                (elem: any) => elem.textContent
            )

            if (availability?.toLowerCase() === 'add to cart') {
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
            await this.page.waitForSelector('div.sale-price > span.price, div.regular-price > span.price', {
                timeout: 3000,
            })
            const price = textToNumber(
                await this.page.$eval(
                    'div.sale-price > span.price, div.regular-price > span.price',
                    (elem: any) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
