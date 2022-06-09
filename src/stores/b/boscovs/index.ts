import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Boscovs extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="add-to-cart"]', {timeout: 10000})
            const availability = await this.page.$eval('button[id="add-to-cart"]', elem => elem.textContent)

            if (availability?.toLowerCase().includes("add to bag")) {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('*[itemprop="price"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('*[itemprop="price"]', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }

}