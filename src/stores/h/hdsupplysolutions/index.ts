import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Hdsupplysolutions extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[data-hds-tag="product-detail__product-name"]')
    }

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
