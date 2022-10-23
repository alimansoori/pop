import Store from '../../Store'
import { Browser, Page } from 'puppeteer'

export default class Abt extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)

        this.addPriceSelector({
            selector: 'div.product-page_info div.pricing-item-price > span',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
