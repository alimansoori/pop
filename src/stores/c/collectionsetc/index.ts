import Store from "../../Store";
import {Page} from "puppeteer";

export default class Collectionsetc extends Store {
    constructor(page: Page, url: string) {
        super(page, url);

    }
}