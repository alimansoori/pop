import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bigbadtoystore extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="product-name-ada"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'h2.ada-product-h2.ada-order-h2',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.price',
            render: 'text',
        })
    }
}
