import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Abbottstore extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.pdp-info__title')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.pdp-info__title',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div[id="page-slider"] div.fotorama__stage__frame.fotorama__active img.fotorama__img',
            render: 'src',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[id="stock-status"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[id="current-price"]',
            render: 'text',
        })
    }
}
