import ISelectors from './ISelectors'
import { TypePriceSelector, TypePriceSelectors } from '../@types/TypePriceSelectors'

export default class CssSelectors implements ISelectors {
    private categoryBlock = ''
    private categoryMultiplication = 'page'
    private categoryPagination = ''
    private categoryProductAvailability = ''
    private categoryProductBlock = ''
    private categoryProductImg = ''
    private categoryProductPrice = ''
    private categoryProductTitle = ''
    private categoryProductTitle2 = ''
    private categoryProductUPC = ''
    private categoryProductUrl = ''
    private productAvailability = ''
    private productImg = ''
    private productUPC = ''
    private productPrice: TypePriceSelectors = {}
    private productTitle = ''
    private productTitle2 = ''
    private nextPage = ''
    private seeMore = ''
    private addToCartBtn = ''
    private addToCartBtnContent = ''

    setCategoryBlock(selector: string): this {
        this.categoryBlock = selector
        return this
    }

    getCategoryBlock(): string {
        return this.categoryBlock
    }

    getCategoryMultiplication(): string {
        return this.categoryMultiplication
    }

    getCategoryPagination(): string {
        return this.categoryPagination
    }

    getCategoryProductAvailability(): string {
        return this.categoryProductAvailability
    }

    getCategoryProductBlock(): string {
        return this.categoryProductBlock
    }

    getCategoryProductImg(): string {
        return this.categoryProductImg
    }

    getCategoryProductPrice(): string {
        return this.categoryProductPrice
    }

    getCategoryProductTitle(): string {
        return this.categoryProductTitle
    }

    getCategoryProductTitle2(): string {
        return this.categoryProductTitle2
    }

    getCategoryProductUPC(): string {
        return this.categoryProductUPC
    }

    getCategoryProductUrl(): string {
        return this.categoryProductUrl
    }

    getProductAvailability(): string {
        return this.productAvailability
    }

    getProductImg(): string {
        return this.productImg
    }

    getProductPrice(): TypePriceSelectors {
        return this.productPrice
    }

    getProductTitle(): string {
        return this.productTitle
    }

    getProductTitle2(): string {
        return this.productTitle2
    }

    getProductUPC(): string {
        return this.productUPC
    }

    setCategoryMultiplication(selector: string): this {
        this.categoryMultiplication = selector
        return this
    }

    setCategoryPagination(selector: string): this {
        this.categoryPagination = selector
        return this
    }

    setCategoryProductAvailability(selector: string): this {
        this.categoryProductAvailability = selector
        return this
    }

    setCategoryProductBlock(selector: string): this {
        this.categoryProductBlock = selector
        return this
    }

    setCategoryProductImg(selector: string): this {
        this.categoryProductImg = selector
        return this
    }

    setCategoryProductPrice(selector: string): this {
        this.categoryProductPrice = selector
        return this
    }

    setCategoryProductTitle(selector: string): this {
        this.categoryProductTitle = selector
        return this
    }

    setCategoryProductTitle2(selector: string): this {
        this.categoryProductTitle2 = selector
        return this
    }

    setCategoryProductUPC(selector: string): this {
        this.categoryProductUrl = selector
        return this
    }

    setCategoryProductUrl(selector: string): this {
        this.categoryProductUrl = selector
        return this
    }

    setProductAvailability(selector: string): this {
        this.productAvailability = selector
        return this
    }

    setProductImg(selector: string): this {
        this.productImg = selector
        return this
    }

    addProductPrice(selector: TypePriceSelector): this {
        this.productPrice[selector.selector] = selector
        return this
    }

    setProductTitle(selector: string): this {
        this.productTitle = selector
        return this
    }

    setProductTitle2(selector: string): this {
        this.productTitle2 = selector
        return this
    }

    setProductUPC(selector: string): this {
        this.productUPC = selector
        return this
    }

    getAddToCartBtn(): string {
        return this.addToCartBtn
    }

    getNextPage(): string {
        return this.nextPage
    }

    getSeeMore(): string {
        return this.seeMore
    }

    setAddToCartBtn(selector: string): this {
        this.addToCartBtn = selector
        return this
    }

    setNextPage(selector: string): this {
        this.nextPage = selector
        return this
    }

    setSeeMore(selector: string): this {
        this.seeMore = selector
        return this
    }

    getAddToCartBtnContent(): string {
        return this.addToCartBtnContent
    }

    setAddToCartBtnContent(content: string): this {
        this.addToCartBtnContent = content
        return this
    }
}
