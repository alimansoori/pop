import Store from '../../Store'
import { Page, Browser } from 'puppeteer'

export default class Pfaltzgraff extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'meta[property="product:price:amount"]',
            attr: 'content',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
