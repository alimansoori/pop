import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

export default class DesignMilk extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)
    }

    async productExistCalculate(): Promise<void> {}
}
