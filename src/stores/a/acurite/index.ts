import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Acurite extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('p[title="Availability"] > span', {timeout: 10000})
            const availability = await this.page.$eval('p[title="Availability"] > span', elem => elem.textContent)

            if (availability?.toLowerCase().includes("in stock")) {
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
            await this.page.waitForSelector('span[data-price-type="finalPrice"], span[data-price-type="maxPrice"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('span[data-price-type="finalPrice"], span[data-price-type="maxPrice"]', elem => elem.getAttribute('data-price-amount'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}