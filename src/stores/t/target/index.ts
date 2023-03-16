import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { sleep } from '../../../utils/sleep'
import { textToNumber } from '../../../lib/helper'
import { find } from 'shelljs'

export default class Target extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
        /*this.scrapUntilBlock = true
    this.excludeAssets = [
        // 'https://assets.targetimg1.com/',
        'https://redsky.target.com/redsky_aggregations',
        'https://api.target.com/location_fulfillment_aggregations',
        'https://target.scene7.com',
        'https://taglocker.target.com/',
    ]*/
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-test="product-title"]')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1[data-test="product-title"]',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'meta[property="og:image"]',
            render: 'content',
        })
    }

    async availibilityCalculate(): Promise<void> {
        if (this.isSecond) {
            this.setAvailability(true)
            return
        }
        try {
            await sleep(5000)
            await this.page.waitForSelector('button[data-test="fulfillment-cell-shipping"]', { timeout: 15000 })
            await this.page.click('button[data-test="fulfillment-cell-shipping"]')
        } catch (e: any) {
            console.log(e.message)
        }

        await this.checkAvailability({
            selector: 'button[data-test="shippingButton"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        if (this.isSecond) {
            const findPrice = (await this.page.content()).match(/(formatted_current_price\\":\\")(\$\d+(\.\d\d)?)/)
            if (findPrice && findPrice.length && findPrice[2]) {
                this.setPrice(textToNumber(findPrice[2]))
            }
            return
        }
        await this.checkPrice({
            selector1: 'span[data-test="product-price"]',
            render: 'text',
        })
    }
}
