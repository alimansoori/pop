import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import sleep from '../../../utils/sleep'

export default class Target extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('h1[data-test="product-title"]', { timeout: 10000 })
            const canonical = await this.page.$eval('link[rel="canonical"]', (elem: any) => elem.getAttribute('href'))
            if (canonical) {
                this.url = canonical
            }
        } catch (e: any) {
            this.productExist = false
        }
    }

    async availibilityCalculate(): Promise<void> {
        try {
            try {
                await sleep(5000)
                await this.page.waitForSelector('button[data-test="fulfillment-cell-shipping"]', { timeout: 10000 })
                await this.page.click('button[data-test="fulfillment-cell-shipping"]')
            } catch (e: any) {
                console.log(e.message)
            }

            await this.page.waitForSelector('button[data-test="shippingButton"]', { timeout: 10000 })

            const availability = await this.page.$eval(
                'button[data-test="shippingButton"]',
                (elem: any) => elem.textContent
            )

            if (availability === 'Add to cart') {
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
            await this.page.waitForSelector('span[data-test="product-price"]', { timeout: 5000 })
            const price = textToNumber(
                await this.page.$eval('span[data-test="product-price"]', (elem: any) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
