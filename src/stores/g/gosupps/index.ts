import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Gosupps extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('*.product-name h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[title="Add to Cart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*.special-price > *.price',
            selector2: '*.old-price > *.price',
            render: 'text',
        })
    }
}
