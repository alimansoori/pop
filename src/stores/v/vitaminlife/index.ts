import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Vitaminlife extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product_name')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.product_name',
            render: 'text',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.product_section button[name="add"]',
            render: 'text',
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.product_section *.modal_price *.current_price *.money',
            render: 'text',
        })
    }
}
