import Store from "../../Store";
import {Page} from "puppeteer";

export default class Biglots extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.out-of-stock-msg', {timeout: 10000})
            const availability = await this.page.$eval('div.out-of-stock-msg', elem => elem.textContent)

            if (availability) {
                this.setAvailability(false)
            } else {
                this.setAvailability(true)
            }
        } catch (e: any) {
            this.setAvailability(true)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}