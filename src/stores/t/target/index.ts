import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import sleep from '../../../utils/sleep'

export default class Target extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.viewPageSource = false
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-test="product-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await sleep(5000)
            await this.page.waitForSelector('button[data-test="fulfillment-cell-shipping"]', { timeout: 10000 })
            await this.page.click('button[data-test="fulfillment-cell-shipping"]')
        } catch (e: any) {
            console.log(e.message)
        }

        await this.checkAvailability({
            selector: 'button[data-test="shippingButton"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span[data-test="product-price"]',
            render: 'text',
        })
    }
}
