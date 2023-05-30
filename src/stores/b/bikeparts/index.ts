import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bikeparts extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-details h2')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'div.product-details h2',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: '',
            render: '',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button.btn-cart',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*.price-new',
            render: 'text',
        })
    }
}
