import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { sleep } from '../../../utils/sleep'

export default class Cvs extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        // this.viewPageSource = false
        this.excludeAssets = [
            // /https:\/\/api.bazaarvoice.com/,
            // 'https://www.cvs.com/api/guest/v1/token',
            // 'https://www.cvs.com/RETAGPV2/CvsHeaderConfigServicesActor/V1/getHeader',
            // /https:\/\/www\.cvs\.com\/retail-component-server\/v1\/ui\/header-build/,
            // /https:\/\/apps.nexus.bazaarvoice.com/,
            // 'https://www.cvs.com/ruicket-of-Graue-on-Withou-when-Frogge-name-nors',
            // /https:\/\/display.ugc.bazaarvoice.com/,
            // 'https://www.cvs.com/shop-assets/js/VisitorAPI.js',
            // /https:\/\/www.cvs.com\/N-rGG2f3kh/,
            // 'https://www.cvs.com/RETAGPV1/retail/V1/webContent',
            // 'https://www.cvs.com/RETAGPV3/OnlineShopService/V2/getSKUInventoryAndPrice',
            // 'https://tags.tiqcdn.com/utag/cvs/fs/prod/utag.js',
        ]
        // this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[role="heading"]')
        // this.productExist = this.isSecond
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await sleep(5000)
            await this.page.waitForSelector('div[aria-label="Shipping"]', { timeout: 10000 })
            await this.page.click('div[aria-label="Shipping"]')
            await sleep(1000)
        } catch (e: any) {
            console.log(e.message)
        }

        await this.checkAvailability({
            selector: 'div[data-class="pdp-add-to-basket-btn"]',
            render: 'text',
            outputArray: ['add for shipping'],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.r-1khnkhu.r-1jn44m2.r-3i2nvb',
            render: 'text',
        })
    }
}
