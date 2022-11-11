import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Atomicempire extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.main-item-details div.price-section div.h5')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.main-item-details div.price-section div.h5',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.pricing >div.row > div:not(:first-child) > strong',
            render: 'text',
        })
    }
}
