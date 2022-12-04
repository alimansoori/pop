import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Acehardware extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        // this.siteIsBlocked = true
        // this.runPostman = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="pdp-detail-inner"] h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.product-add-to-cart-info div:not(.is-loading) > button[id="add-to-cart"]:not(.is-disabled)',
            render: 'text',
            outputArray: [],
        })
        this.availability = true
        /*try {
            let availability = ''
            const selector = 'button[id="add-to-cart"].ace-add-to-cart-btn.is-disabled'
            if (this.runPostman) {
                availability = this.resultReq.$(selector).text()
            } else {
                await this.page.waitForSelector(selector, { timeout: 20000 })
                availability = await this.page.$eval(selector, (elem: any) => elem.elem.getAttribute('id'))
            }

            if (availability?.toLowerCase().includes('add-to-cart')) {
                this.setAvailability(false)
            } else {
                this.setAvailability(true)
            }
        } catch (e: any) {
            this.setAvailability(true)
        }*/
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"]',
            render: 'text',
        })
    }
}
