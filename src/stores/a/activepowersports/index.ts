import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Activepowersports extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.ProductMain em[itemprop="price"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('div.ProductMain em[itemprop="price"]', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}