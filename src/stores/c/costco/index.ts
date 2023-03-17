import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { sleep } from '../../../utils/sleep'

export default class Costco extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[automation-id="productName"]')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('input[id="eddZipCodeField"]')
            await this.page.waitForSelector('input[id="edd-check-button"]')
            await this.page.type('input[id="eddZipCodeField"]', '10001')
            await sleep(1000)
            await this.page.click('input[id="edd-check-button"')
            await sleep(6000)
        } catch (e: any) {
            console.log(e.message)
        }
        await this.checkAvailability({
            selector: 'meta[property="og:availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[automation-id="productPriceOutput"]',
            render: 'text',
        })
    }
}
