import Store from "../../Store";
import {Page} from "puppeteer";
import {click, textToNumber} from "../../../lib/helper";
import sleep from "../../../utils/sleep";

export default class Macys extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        await this.usShippingSelect()
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }

    async usShippingSelect(): Promise<Boolean> {
        try {
            await this.page.waitForSelector('button.cta-btn-ship-to-us[data-auto="continue-shopping"]', {timeout: 3000})
            await click(this.page, 'button.cta-btn-ship-to-us[data-auto="continue-shopping"]')
            await sleep(5000)
            return true
        } catch (e: any) {
            return false
        }
    }

}