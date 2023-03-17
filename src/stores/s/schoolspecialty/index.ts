import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Schoolspecialty extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.main_header')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[id="productPageAdd2Cart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.price_ship_container meta[itemprop="price"]',
            render: 'content',
        })
    }
}
