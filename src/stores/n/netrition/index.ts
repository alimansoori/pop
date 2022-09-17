import Store from '../../Store'
import { Page } from 'puppeteer'

export default class Netrition extends Store {
    constructor(page: Page, url: string) {
        super(page, url)
    }

    async productExistCalculate(): Promise<void> {}
}
