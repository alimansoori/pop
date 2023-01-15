import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Doitbest extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.ProductTitle')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'input[id="AddToCartForm_Submit"]',
            render: 'value',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.ProductContent *.ProductPriceRetail',
            render: 'text',
        })
    }
}
