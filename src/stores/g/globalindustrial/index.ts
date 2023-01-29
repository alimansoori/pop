import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Globalindustrial extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[id="main-prod-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
