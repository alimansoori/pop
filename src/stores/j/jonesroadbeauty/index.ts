import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Jonesroadbeauty extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product__description-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.product__form-button__text',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.product__form-price *.product__form-price--regular',
            render: 'text',
        })
    }
}
