import Store from '../../Store'
import { Browser, Page } from 'puppeteer'

export default class Bookpal extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'span#unit-price',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
