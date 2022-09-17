import Store from '../../Store'
import { Page } from 'puppeteer'

export default class Pfaltzgraff extends Store {
    constructor(page: Page, url: string) {
        super(page, url)

        this.addPriceSelector({
            selector: 'meta[property="product:price:amount"]',
            attr: 'content',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
