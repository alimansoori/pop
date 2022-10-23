import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

export default class Lakeside extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)

        this.addPriceSelector({
            selector: 'aside#js-productdetail__cont--id p.sku-desc__caption span.sku-desc__price',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
