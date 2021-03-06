import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Keurig extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
        // this.siteIsBlocked = true
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="divAddTOCart"]', {timeout: 10000})
            const availability = await this.page.$eval('button[id="divAddTOCart"]', elem => elem.textContent)

            if (availability?.toLowerCase().includes("add to cart")) {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.productExist = false
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span.big-price', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('span.big-price', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}