import Store from '../../Store'
import { Browser, Page } from 'puppeteer'

export default class Bookpal extends Store {
    constructor(page: Page, browser: Browser, url: string) {
        super(page, browser, url)

        this.addPriceSelector({
            selector: 'span#unit-price',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
