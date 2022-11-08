import { Page } from 'puppeteer'
import { TypePriceSelector } from '../@types/TypePriceSelectors'
import ISelectors from './ISelectors'
import IStoreOptions from './IStoreOptions'
import ProductTitle from './ProductTitle'

export default interface IStore {
    statusCode: number | undefined
    error: string
    createBrowser(): Promise<void>
    productIsExist(): boolean
    getPrice(): number
    getTitleClass(): ProductTitle
    getPage(): Page
    setCanonical(): void
    getUrl(): string
    selectors(): ISelectors
    options(): IStoreOptions
    getDomain(): string | undefined
    isAvailability(): boolean
    setCategoriesUrl(categories: string[]): this
    getCategoriesUrl(): string[]
    addPriceSelector(selector: TypePriceSelector): this
    getAddToCartBtnContent(): string
    setPageParam(pageParamName: string): this
    getPageParam(): string
    hasScrollDown(): boolean
    setScrollDown(isScrollDown: boolean): this
    scrape(isBan?: boolean): Promise<void>
    scrapeWholeSite(): Promise<void>
}
