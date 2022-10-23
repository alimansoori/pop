import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

import { click } from '../../../lib/helper'
import sleep from '../../../utils/sleep'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Macys extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        // await this.usShippingSelect()
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }

    async usShippingSelect(): Promise<boolean> {
        try {
            await this.page.waitForSelector('button.cta-btn-ship-to-us[data-auto="continue-shopping"]', {
                timeout: 3000,
            })
            await click(this.page, 'button.cta-btn-ship-to-us[data-auto="continue-shopping"]')
            await sleep(5000)
            return true
        } catch (e: any) {
            return false
        }
    }
}
