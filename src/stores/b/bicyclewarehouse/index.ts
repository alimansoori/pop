import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bicyclewarehouse extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        // this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product__title h1')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'div.product__title h1',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'media-gallery[data-desktop-layout="thumbnail_slider"] img',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[name="add"]',
            render: 'text',
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.product__info-wrapper div.price__sale *.price-item--regular',
            selector2: 'div.product__info-wrapper div.price__regular *.price-item--regular',
            render: 'text',
        })
    }
}
