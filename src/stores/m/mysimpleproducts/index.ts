import Store from '../../Store'
import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Mysimpleproducts extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        // await this.productExistBySelector('')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div[title="Availability"] div.instock span', { timeout: 10000 })
            const availability = await this.page.$eval(
                'div[title="Availability"] div.instock span',
                (elem: any) => elem.textContent
            )

            if (availability === 'In stock!') {
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
            await this.page.waitForSelector('meta[property="product:price:amount"]', { timeout: 5000 })
            const price = textToNumber(
                await this.page.$eval('meta[property="product:price:amount"]', (elem: any) =>
                    elem.getAttribute('content')
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
