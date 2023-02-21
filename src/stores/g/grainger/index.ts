import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Grainger extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[data-testid="pdp-header"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
        this.setAvailability(true)
    }
}
