import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'

export default class Miniaturemarket extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            if (this.runPostman) {
                const availability = this.resultReq.$('a[title="Add to Cart"]').text()
                if (availability?.toLowerCase().trim().includes('add to cart')) {
                    this.setAvailability(true)
                }
            } else {
                await this.page.waitForSelector('a[title="Add to Cart"]', { timeout: 10000 })
                const availability = await this.page.$eval('a[title="Add to Cart"]', (elem: any) => elem.textContent)

                if (availability?.toLowerCase().includes('add to cart')) {
                    this.setAvailability(true)
                } else {
                    this.setAvailability(false)
                }
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            if (this.runPostman) {
                this.setPrice(textToNumber(this.resultReq.$('*[class="special-price"] > span.price').text().trim()))
            } else {
                await this.page.waitForSelector('*[class="special-price"] > span.price', { timeout: 10000 })
                this.setPrice(
                    await this.page.$eval('*[class="special-price"] > span.price', (elem: any) => elem.textContent)
                )
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }
}
