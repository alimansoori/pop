import Store from "../../Store";
import {Page} from "puppeteer";

export default class Tactical extends Store {
    constructor(page: Page, url: string) {
        super(page, url);

        this.addPriceSelector({
            selector: 'div.product-info-price span.price',
            attr: 'text'
        })
    }
}