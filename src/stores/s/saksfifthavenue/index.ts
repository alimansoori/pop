import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Saksfifthavenue extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-brand-name > a.product-brand')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.primary-images-container img[itemprop="image"]',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
