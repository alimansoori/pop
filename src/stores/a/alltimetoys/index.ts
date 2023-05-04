import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Alltimetoys extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.productView-title')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'section.productView-images img',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
