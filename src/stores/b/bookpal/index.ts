import Store from "../../Store";
import {Page} from "puppeteer";

export default class Bookpal extends Store {
    constructor(page: Page, url: string) {
        super(page, url);

        this.addPriceSelector({
            selector: 'span#unit-price',
            attr: 'text'
        })
    }

    async productExistCalculate(): Promise<void> {
    }
}