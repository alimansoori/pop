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
            await this.page.waitForSelector('ul.fulfillment__container > li:last-child', {
                timeout: 3000,
            })

            await this.page.click('ul.fulfillment__container > li:last-child')
            await sleep(3000)

            await this.checkAvailability({
                selector: 'ul.fulfillment__container > li:last-child:not(.disabled)',
                render: null,
                outputArray: [],
            })
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
