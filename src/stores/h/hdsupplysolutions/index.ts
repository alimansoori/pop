import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Hdsupplysolutions extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.product-detail__description-attributes a[data-hds-tag="product-details__add-to-cart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.product-detail__description-attributes span[data-hds-tag="price--offerprice"]',
            render: 'data-price',
        })
    }
}
