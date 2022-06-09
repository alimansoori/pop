import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";
import {EnumLoadType} from "../../../@types/EnumLoadType";

export default class Sephora extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[data-at="add_to_basket_btn"] > span', {timeout: 10000})
            const availability = await this.page.$eval('button[data-at="add_to_basket_btn"] > span', elem => elem.textContent)

            if (availability?.toLowerCase().includes("add to basket")) {
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
            await this.page.waitForSelector('span.css-7lbkes b.css-0', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('span.css-7lbkes b.css-0', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}