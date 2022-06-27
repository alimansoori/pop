import Store from "../../Store";
import {Page} from "puppeteer";

export default class Bigapplecollectibles extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[data-default-text="Add to Cart"]', {timeout: 10000})
            const availability = await this.page.$eval('span[data-default-text="Add to Cart"]', elem => elem.getAttribute('data-default-text'))

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