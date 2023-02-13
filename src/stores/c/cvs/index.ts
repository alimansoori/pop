import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { sleep } from '../../../utils/sleep'

export default class Cvs extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.viewPageSource = false
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[role="heading"]')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await sleep(5000)
            await this.page.waitForSelector('div[aria-label="Shipping"]', { timeout: 10000 })
            await this.page.click('div[aria-label="Shipping"]')
            await sleep(1000)
        } catch (e: any) {
            console.log(e.message)
        }

        await this.checkAvailability({
            selector: 'div[data-class="pdp-add-to-basket-btn"]',
            render: 'text',
            outputArray: ['add for shipping'],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.r-1khnkhu.r-1jn44m2.r-3i2nvb',
            render: 'text',
        })
    }
}
