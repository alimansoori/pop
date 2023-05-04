import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { sleep } from '../../../utils/sleep'

export default class BGsales extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
        try {
            await this.login()
        } catch (e: any) {
            console.error('hhhh')
        }
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1[itemprop="name"]',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'img[itemprop="image"]',
            render: 'src',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'link[itemprop="availability"]',
            render: 'href',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"]',
            render: 'text',
        })
    }

    private async login(): Promise<void> {
        try {
            await this.page.waitForSelector('p.product-views-price-message a')
            await this.page.goto('https://www.b-gsales.com/sca-dev-2020-1/checkout.ssp?is=login&login=T#login-register')
            const emailSelector = 'input[id="login-email"]'
            const passSelector = 'input[id="login-password"]'
            await this.page.waitForSelector(emailSelector)
            await this.page.waitForSelector(passSelector)
            await this.page.type(emailSelector, 'alimanssouri221@gmail.com', { delay: 10 })
            await this.page.type(passSelector, 'aRZaCdR99e!hZg!', { delay: 10 })
            await this.page.click('button.login-register-login-submit')
            await sleep(5000)
            await this.page.goto(this.getUrl())
        } catch (e: any) {
            console.error(e.message)
        }
    }
}
