import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Belk extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1 *[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'link[itemprop="availability"]',
            render: 'href',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span[itemprop="price"]',
            selector2: 'div.price-standard, span.standardprice',
            render: 'text',
        })
    }
}
