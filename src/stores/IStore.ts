import {Page} from "puppeteer";
import {TypePriceSelector, TypePriceSelectors} from "../@types/TypePriceSelectors";
import ISelectors from "./ISelectors";
import IStoreOptions from "./IStoreOptions";

export default interface IStore {
    getPrice(): number
    getPage(): Page
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
    scrape(): Promise<void>
}