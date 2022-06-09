import InterfaceAmazon from "./InterfaceAmazon";
import AmzLogin from "./AmzLogin";
import {Page} from "puppeteer";

class AzInsight implements InterfaceAmazon{
    private page: Page
    private amzLogin: AmzLogin

    constructor(page: Page) {
        this.page = page
        this.amzLogin = new AmzLogin(page)
        this.login()
    }

    async login(): Promise<boolean> {
        return await this.amzLogin.login()
    }

}

export default AzInsight