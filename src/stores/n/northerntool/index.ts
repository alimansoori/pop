import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Northerntool extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.card-title-header')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.card-title-header',
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
            selector: 'div.add_to_cart_btn button.Add-to-cart-button',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.nte-pdp-product-card div.product-offer-price.offer-price.unit-price',
            render: 'text',
        })
    }
}
