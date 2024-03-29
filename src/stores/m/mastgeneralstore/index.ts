import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Mastgeneralstore extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h3.product_title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'a.addToCart',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'h4.salePrice',
            render: 'text',
        })
    }
}
