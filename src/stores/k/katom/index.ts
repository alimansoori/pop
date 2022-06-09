import Store from "../../Store";
import {Page} from "puppeteer";
import {categories} from "./categories";
import {click, shouldNotExist, typeText} from "../../../lib/helper";

export default class Katom extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}