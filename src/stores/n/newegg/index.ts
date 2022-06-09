import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Newegg extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div#ProductBuy > div.nav-row > div.nav-col button.btn-primary', {timeout: 10000})
            const availability = await this.page.$eval('div#ProductBuy > div.nav-row > div.nav-col button.btn-primary', elem => elem.textContent)

            if (availability) {
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
            await this.page.waitForSelector('quadpay-widget-v3#quadpaycontainer', {timeout: 7000})
            const price = textToNumber(
                await this.page.$eval('quadpay-widget-v3#quadpaycontainer', elem => elem.getAttribute('amount'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}