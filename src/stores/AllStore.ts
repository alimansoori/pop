import Store from './Store'
import { EnumLoadType } from '../@types/EnumLoadType'

export default class AllStore extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.pdp-card-name', 1)
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.pdp-card-name',
            render: 'text',
        })
    }

    /*async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }*/
}
