import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-21-2023
export default class Rainbowresource extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.details_item_name h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button.addToCart_button',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[id="content"] div.details_desc div.price_wrapper > *.price_value',
            render: 'text',
        })
    }
}
