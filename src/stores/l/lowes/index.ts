import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Lowes extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="pdp-lpd"] h1.product-desc')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('label.tile.radio-tile.delivery-tile input[type="radio"]', {
                timeout: 10000,
            })
            await this.page.click('label.tile.radio-tile.delivery-tile input[type="radio"]')

            await this.checkAvailability({
                selector: 'div.atc-buy-box button.btn-add.atc',
                render: 'text',
                outputArray: [],
            })
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.newPriceWrapper div.main-price',
            render: 'text',
        })
    }
}
