import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Pamperedchef extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="addAnchor"]', {timeout: 10000})
            const availability = await this.page.$eval('button[id="addAnchor"]', elem => elem.textContent)

            if (availability?.toLowerCase().includes("add to cart")) {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}