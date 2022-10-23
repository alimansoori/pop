import Store from '../../Store'
import { Browser, Page } from 'puppeteer'

export default class A4c extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)

        this.addPriceSelector({
            selector: 'div.price--main span.money',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
