import Store from "../../Store";
import {Page} from "puppeteer";

export default class A4c extends Store {
    constructor(page: Page, url: string) {
        super(page, url);

        this.addPriceSelector({
            selector: 'div.price--main span.money',
            attr: 'text'
        })
    }

    async productExistCalculate(): Promise<void> {
    }
}