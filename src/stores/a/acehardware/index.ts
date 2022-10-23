import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Acehardware extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="add-to-cart"].ace-add-to-cart-btn.is-disabled', {
                timeout: 20000,
            })
            const availability = await this.page.$eval(
                'button[id="add-to-cart"].ace-add-to-cart-btn.is-disabled',
                (elem) => elem.getAttribute('id')
            )

            if (availability === 'add-to-cart') {
                this.setAvailability(false)
            } else {
                this.setAvailability(true)
            }
        } catch (e: any) {
            this.setAvailability(true)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[itemprop="price"]', {
                timeout: 3000,
            })
            const price = textToNumber(await this.page.$eval('span[itemprop="price"]', (elem) => elem.textContent))

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
