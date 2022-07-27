import Store from "../../Store";
import {Page} from "puppeteer";
import {EnumLoadType} from "../../../@types/EnumLoadType";

export default class Walgreens extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('[id="productTitle"]', {timeout: 10000})
            await this.page.$eval('[id="productTitle"]', elem => elem.textContent)

            try {
                await this.page.waitForSelector('[id="wag-shipping-tab"] .message__status', {timeout: 10000})
                const availability = await this.page.$eval('[id="wag-shipping-tab"] .message__status', elem => elem.textContent)

                if (availability?.toLowerCase().includes("out of stock") || availability?.toLowerCase().includes("not available")) {
                    this.setAvailability(false)
                } else {
                    this.setAvailability(true)
                }
            } catch (e: any) {
                this.setAvailability(true)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}