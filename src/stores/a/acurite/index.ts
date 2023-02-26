import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Acurite extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.page-title')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.page-title',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.fotorama__stage__frame.fotorama__active > img',
            render: 'src',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="product-addtocart-button"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span[data-price-type="finalPrice"], span[data-price-type="maxPrice"]',
            render: 'data-price-amount',
        })
    }
}
