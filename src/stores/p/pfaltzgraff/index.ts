import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

export default class Pfaltzgraff extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)

        this.addPriceSelector({
            selector: 'meta[property="product:price:amount"]',
            attr: 'content',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
