import Store from '../../Store'
import { Page } from 'puppeteer'
import { textToNumber } from '../../../lib/helper'

export default class Guitarcenter extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector(
                'section[id="PDPRightRailWrapper"] div.PDPCTA-wrapper button.ant-btn.ant-btn-primary > span > span',
                { timeout: 10000 }
            )
            const availability = await this.page.$eval(
                'section[id="PDPRightRailWrapper"] div.PDPCTA-wrapper button.ant-btn.ant-btn-primary > span > span',
                (elem) => elem.textContent
            )

            if (availability === 'Add to Cart') {
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
            await this.page.waitForSelector('div.product-info div.price-container > span.sale-price', { timeout: 3000 })
            const price = textToNumber(
                await this.page.$eval(
                    'div.product-info div.price-container > span.sale-price',
                    (elem) => elem.textContent
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
