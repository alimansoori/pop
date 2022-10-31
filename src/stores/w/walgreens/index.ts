import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import sleep from '../../../utils/sleep'

export default class Walgreens extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('[id="productTitle"]', { timeout: 10000 })
            await this.page.$eval('[id="productTitle"]', (elem: any) => elem.textContent)
            await sleep(3000)

            try {
                await this.page.waitForSelector('ul.fulfillment__container > li:last-child .fulfillment_title > p', {
                    timeout: 3000,
                })
                const availability = await this.page.$eval(
                    'ul.fulfillment__container > li:last-child .fulfillment_title > p',
                    (elem: any) => elem.textContent
                )

                if (
                    availability?.toLowerCase().trim().includes('out of stock') ||
                    availability?.toLowerCase().trim().includes('not available')
                ) {
                    this.setAvailability(false)
                } else {
                    this.setAvailability(true)
                }
            } catch (e: any) {
                this.setAvailability(true)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
