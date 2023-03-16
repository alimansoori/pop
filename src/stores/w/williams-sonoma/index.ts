import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class WilliamsSonoma extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = false
        // this.excludeAssets = [
        //     'williams-sonoma.com/promotion/',
        //     'williams-sonoma.com/api/',
        //     'williams-sonoma.com/products',
        //     'williams-sonoma.com/cacheable',
        //     'williams-sonoma.com/search',
        //     'williams-sonoma.com/international',
        //     'williams-sonoma.com/svc',
        //     'https://platform.twitter.com/',
        //     'https://www.williams-sonoma.com/cDjcSIL8Q/r7G4OtNg',
        //     'https://www.williams-sonoma.com/itpm',
        //     'https://display.ugc.bazaarvoice.com/',
        //     'https://r.bing.com',
        //     'https://bing.com',
        //     /^(https:\/\/www.williams-sonoma.com\/\.static)((?!dist\/external).)*$/,
        //     'https://widgets.pinterest.com/',
        //     'facebook.net',
        //     'virtualearth.net',
        //     'truyo.com',
        //     'tiqcdn.com',
        // ]
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-test-id="product-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[data-test-id="btn-addtobasket"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.price-qty-fulfillment li.product-price *.amount',
            render: 'text',
        })
    }
}
