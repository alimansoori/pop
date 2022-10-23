import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

import { EnumLoadType } from '../../../@types/EnumLoadType'
import { textToNumber } from '../../../lib/helper'
import sleep from '../../../utils/sleep'

export default class Gamestop extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector(
                'label[data-testid="attribute-New-label"] > div:not(.attribute-strikethrough-unselected)',
                { timeout: 10000 }
            )
            await this.page.click(
                'label[data-testid="attribute-New-label"] > div:not(.attribute-strikethrough-unselected)'
            )
            await sleep(3000)

            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[data-testid="price-default"]', { timeout: 10000 })
            const price = textToNumber(
                await this.page.$eval('span[data-testid="price-default"]', (elem) => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
