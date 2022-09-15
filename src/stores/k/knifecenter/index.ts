import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Knifecenter extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async productExistCalculate(): Promise<void> {
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('a.instock', {timeout: 10000})
            const availability = await this.page.$eval('a.instock', elem => elem.textContent)

            if (availability === "In Stock") {
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
            await this.page.waitForSelector('h2.price span:nth-child(2)', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('h2.price span:nth-child(2)', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}