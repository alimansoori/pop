import Store from '../../Store'
import { Page } from 'puppeteer'

export default class DesignMilk extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}
}
