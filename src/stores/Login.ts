import {Page} from "puppeteer";
import {click, shouldNotExist, typeText} from "../lib/helper";

export default class Login{
    private page: Page
    private loginUrl: string

    constructor(page: Page, loginUrl: string) {
        this.page = page
        this.loginUrl = loginUrl
    }

    async login(username: string, password: string) {
        await this.page.goto(this.loginUrl)

        await typeText(this.page, 'input#email', 'alimanssouri221@gmail.com')
        await typeText(this.page, 'input#password', 'Ali.87654321')
        await click(this.page, 'button[type="submit"]')
        await shouldNotExist(this.page, 'button[type="submit"]')
    }
}

















