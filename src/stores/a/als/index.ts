import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Als extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.vtex-store-components-3-x-productNameContainer')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'img.vtex-store-components-3-x-productImageTag',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
