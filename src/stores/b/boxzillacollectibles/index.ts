import Store from "../../Store";
import {Page} from "puppeteer";

export default class Boxzillacollectibles extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async productExistCalculate(): Promise<void> {
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.tt-wrapper button.btn-addtocart > span:nth-child(2)', {timeout: 10000})
            const availability = await this.page.$eval('div.tt-wrapper button.btn-addtocart > span:nth-child(2)', elem => elem.textContent)

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