import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Pamperedchef extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.m-title-none')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
        await this.checkAvailability({
            selector: 'button[id="addAnchor"]',
            render: 'text',
            outputArray: [],
        })
    }
}
