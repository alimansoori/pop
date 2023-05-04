import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Banggood extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
        this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-title')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.product-title',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.product-image img,div.image-small img',
            render: 'data-src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
        /*await this.checkAvailability({
            selector: 'div.product-action a.add-cart-btn',
            render: 'text',
            outputArray: [],
        })*/
    }
}
