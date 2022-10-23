import Store from '../../Store'
import { Browser, Page } from 'puppeteer'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bedbathandbeyond extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    /*async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[id="pdpSchemaGraph"]', {hidden: true})
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[id="pdpSchemaGraph"]', {hidden: true})
    }*/
}
