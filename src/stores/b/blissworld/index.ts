import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Blissworld extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.ProductMeta__Title')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.ProductMeta__Title',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.Product__Gallery img',
            render: 'data-original-src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*.add_to_bag_btn_true',
            render: 'text',
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*.ProductMeta__Price',
            render: 'text',
        })
    }
}
