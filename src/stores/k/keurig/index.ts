import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Keurig extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        this.excludeAssets = [
            'https://www.keurig.com/pdp/_next/static/css',
            'https://www.keurig.com/medias',
            'https://www.keurig.com/RXxqB26Z6gXvAcByKZYtcN2d',
            // 'https://www.keurig.com/pdp/_next/static/chunks',
            // 'https://api-dep.keurig.com/',
            'https://www.keurig.com/_ui',
            'https://images.keurig.com/is/image/keurig/favicon',
        ]
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('section[id="purchase_options"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[id="divAddTOCart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span.big-price',
            render: 'text',
        })
    }
}
