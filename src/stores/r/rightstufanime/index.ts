import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-20-2023
export default class Rightstufanime extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'meta[property="og:availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[property="og:price:standard_amount"]',
            render: 'content',
        })
    }
}