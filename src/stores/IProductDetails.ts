
export default interface IProductDetails {
    productExistCalculate(): Promise<void>
    productTitleCalculate(): Promise<void>
    priceCalculate(): Promise<void>
    availibilityCalculate(): Promise<void>
}