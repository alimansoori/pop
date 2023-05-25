import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bigelowchemists extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-single-title')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.product-single-title',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div[data-gallery-role="gallery"] img',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
        await this.checkAvailability({
            selector: 'div.product-add-form button[title="Add to Bag"]',
            render: 'text',
        })
    }
}
