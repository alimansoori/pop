import { TypePriceSelector, TypePriceSelectors } from '../@types/TypePriceSelectors'

export default interface ISelectors {
    setCategoryBlock(selector: string): this

    getCategoryBlock(): string

    setCategoryProductBlock(selector: string): this

    getCategoryProductBlock(): string

    setCategoryProductUrl(selector: string): this

    getCategoryProductUrl(): string

    setCategoryProductTitle(selector: string): this

    getCategoryProductTitle(): string

    setCategoryProductTitle2(selector: string): this

    getCategoryProductTitle2(): string

    setCategoryProductImg(selector: string): this

    getCategoryProductImg(): string

    setCategoryProductPrice(selector: string): this

    getCategoryProductPrice(): string

    setCategoryProductUPC(selector: string): this

    getCategoryProductUPC(): string

    setCategoryProductAvailability(selector: string): this

    getCategoryProductAvailability(): string

    setProductTitle(selector: string): this

    getProductTitle(): string

    setProductTitle2(selector: string): this

    getProductTitle2(): string

    setProductImg(selector: string): this

    getProductImg(): string

    addProductPrice(selector: TypePriceSelector): this

    getProductPrice(): TypePriceSelectors

    setProductUPC(selector: string): this

    getProductUPC(): string

    setProductAvailability(selector: string): this

    getProductAvailability(): string

    setCategoryPagination(selector: string): this

    getCategoryPagination(): string

    setCategoryMultiplication(selector: string): this

    getCategoryMultiplication(): string

    setAddToCartBtn(selector: string): this

    getAddToCartBtn(): string

    setNextPage(selector: string): this

    getNextPage(): string

    setSeeMore(selector: string): this

    getSeeMore(): string

    setAddToCartBtnContent(content: string): this

    getAddToCartBtnContent(): string
}
