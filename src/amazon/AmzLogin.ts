import sleep from "../utils/sleep";
import {Page} from "puppeteer";
import MyMath from "../lib/MyMath";

export default class AmzLogin {
    private readonly loginUrl: string
    private readonly username: string
    private readonly password: string
    emailSelector: string
    passwordSelector: string
    continueSelector: string
    submitSelector: string
    private isLoginAmz: boolean = false
    private page: Page

    constructor(page: Page) {
        this.page = page
        this.loginUrl = 'https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_custrec_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&'
        this.username = 'alimanssouri221@gmail.com'
        this.password = 'U-rv-g4Ji5#j@L6'
        this.emailSelector = 'input#ap_email'
        this.passwordSelector = 'input#ap_password'
        this.continueSelector = 'span#continue input#continue'
        this.submitSelector = 'input#signInSubmit'
    }

    async login(): Promise<boolean> {
        try {
            if (this.isLoginAmz) {
                console.log('is login ago')
                return true
            }
            await this.page.goto(this.loginUrl)

            await this.page.type(this.emailSelector, this.username, {
                delay: MyMath.randomIntFromInterval(300, 500)
            })

            await sleep(1000, 2000)
            await this.page.click(this.continueSelector)
            await sleep(1000, 2000)
            await this.page.waitForSelector(this.passwordSelector)

            await this.page.type(this.passwordSelector, this.password, {
                delay: MyMath.randomIntFromInterval(300, 500)
            })

            await sleep(1000, 2000)
            await this.page.click(this.submitSelector)
            await this.page.waitForNavigation()
            console.log('amazonLogin Success')
            this.isLoginAmz = true
            return true
        } catch (err) {
            console.log('amazonLogin.ts Error: ', err)
            this.isLoginAmz = false
            return false
        }
    }

    isLogin(): boolean {
        return this.isLoginAmz
    }
}