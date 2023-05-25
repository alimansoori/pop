import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1/20/2023
export default class Bigbadtoystore extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="product-name-ada"]')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1[class="product-name-ada"]',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div[id="product-slider"] img',
            render: 'src',
            multiple: true,
        })
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
