import { Page } from 'puppeteer'
import IStore from './IStore'
import { TypePriceSelector, TypePriceSelectors } from '../@types/TypePriceSelectors'
import Url from '../lib/Url'
import sleep from '../utils/sleep'
import ISelectors from './ISelectors'
import CssSelectors from './CssSelectors'
import IStoreOptions from './IStoreOptions'
import StoreOptions from './StoreOptions'
import IProductDetails from './IProductDetails'
import { EnumLoadType } from '../@types/EnumLoadType'
import ProductTitle from './ProductTitle'

abstract class Store implements IStore, IProductDetails {
    titleClass: ProductTitle
    protected page: Page
    protected url: string
    protected pageParam = 'page'
    protected categoriesUrl: string[] = []
    protected addToCartBtnContent = ''
    protected availability = false
    protected isScrollDown = false
    protected price = NaN
    protected selectorsPrice: TypePriceSelectors = {}
    private readonly selectorsP: ISelectors
    private readonly optionsP: IStoreOptions
    protected loadType: EnumLoadType = EnumLoadType.LOAD
    protected productExist = true
    protected siteIsBlocked = false

    protected constructor(page: Page, url: string) {
        this.page = page
        this.url = url
        this.selectorsP = new CssSelectors()
        this.optionsP = new StoreOptions()
        this.titleClass = new ProductTitle()
    }

    getTitleClass(): ProductTitle {
        return this.titleClass
    }

    selectors(): ISelectors {
        return this.selectorsP
    }

    options(): IStoreOptions {
        return this.optionsP
    }

    addPriceSelector(selector: TypePriceSelector): this {
        this.selectorsPrice[selector.selector] = selector
        return this
    }

    getPriceSelectors(): TypePriceSelectors {
        return this.selectorsPrice
    }

    public getPage(): Page {
        return this.page
    }

    public isAvailability(): boolean {
        return this.availability
    }

    protected setAvailability(available: boolean): this {
        this.availability = available

        return this
    }

    public getPrice(): number {
        return this.price
    }

    protected setPrice(price: number): void {
        this.price = price
    }

    getDomain(): string | undefined {
        return Url.getDomain(this.getUrl())
    }

    getUrl(): string {
        return this.url
    }

    async scrape(): Promise<void> {
        let url = this.getUrl()

        const scrapUrl =
            'https://api.scraperapi.com/?api_key=4bd0f31c8a7cb7c2dbd60e8b7e79c9f3&country_code=us&url=' + url

        /*const scrapUrl2 =
            'https://api.webscrapingapi.com/v1?api_key=Qh6v8E47BWLM7kYPR9RRDi4zJRY3KYYT&device=desktop&proxy_type=datacenter&render_js=1&wait_until=domcontentloaded&country=us&url=' +
            url*/

        switch (this.getDomain()) {
            case 'walmart':
                url = scrapUrl
                break
            case 'boxed':
                url = url = scrapUrl
                break
            case 'knifecenter':
                url = url = scrapUrl
                break
            case 'pharmaca':
                url = url = scrapUrl
                break
            case 'acmetools':
                url = url = scrapUrl
                break
            default:
                url = this.getUrl()
        }

        if (this.siteIsBlocked) {
            url = scrapUrl
        }

        try {
            await this.page.goto(url, { timeout: 100000, waitUntil: this.loadType })
        } catch (e: any) {
            await this.page.close()
        }

        await this.productExistCalculate()
        if (this.productIsExist()) {
            await this.productTitleCalculate()
            await this.availibilityCalculate()
            await this.priceCalculate()
        }

        // await this.fetchPrice()
    }

    setCategoriesUrl(categories: string[]): this {
        this.categoriesUrl = categories
        return this
    }

    getCategoriesUrl() {
        return this.categoriesUrl
    }

    private scrollDown = async () => {
        if (!this.isScrollDown) return false
        const pageHeight = await this.page.evaluate(() => {
            return document.body.scrollHeight
        })

        for (let i = 0; i < pageHeight; i = i + 50) {
            await this.page.mouse.wheel({ deltaY: i })
            await sleep(400)
        }
        return true
    }

    protected hasNextPage = async (): Promise<boolean> => {
        if (!this.selectors().getNextPage()) return false

        try {
            await this.page.waitForSelector(this.selectors().getNextPage(), { timeout: 5000 })
            return true
        } catch (e: any) {
            return false
        }
    }

    setScrollDown(isScrollDown: boolean): this {
        this.isScrollDown = isScrollDown
        return this
    }

    hasScrollDown(): boolean {
        return this.isScrollDown
    }

    setPageParam(pageParamName: string): this {
        this.pageParam = pageParamName
        return this
    }

    getPageParam(): string {
        return this.pageParam
    }

    getAddToCartBtnContent(): string {
        return this.addToCartBtnContent
    }

    abstract productExistCalculate(): Promise<void>

    async productTitleCalculate(): Promise<void> {
        return Promise.resolve(undefined)
    }

    async availibilityCalculate(): Promise<void> {
        return Promise.resolve(undefined)
    }

    protected async checkAvailibilityBySchemas(selector: string, options = {}): Promise<void> {
        const newOption = {
            timeout: 10000,
            ...options,
        }
        try {
            await this.page.waitForSelector(selector, newOption)
            const jsonSchemas = await this.page.$$eval(selector, (elem) =>
                elem.map((el) => el.textContent?.trim().replace(';', ''))
            )

            this.iterateAvalabilitySchemas(jsonSchemas)
        } catch (e: any) {
            console.log(e.message)
            this.setAvailability(false)
        }
    }

    private iterateAvalabilitySchemas(jsonSchemas: any[]) {
        for (let i = 0; i < jsonSchemas.length; i++) {
            let jsonSchemaParse = jsonSchemas[i]

            jsonSchemaParse = typeof jsonSchemas[i] === 'string' ? JSON.parse(jsonSchemas[i] as string) : jsonSchemas[i]
            if (jsonSchemaParse?.mainEntity) {
                jsonSchemaParse = jsonSchemaParse?.mainEntity
            } else if (jsonSchemaParse?.productLdJson) {
                jsonSchemaParse = jsonSchemaParse?.productLdJson
            } else if (jsonSchemaParse?.['@graph']) {
                this.iterateAvalabilitySchemas(jsonSchemaParse?.['@graph'])
                return
            } else if (jsonSchemaParse?.['@type'] === 'ItemList' && jsonSchemaParse.itemListElement) {
                this.iterateAvalabilitySchemas([jsonSchemaParse.itemListElement[0].item])
                return
            }
            this.offerCalc(jsonSchemaParse)
        }
    }

    offerCalc(jsonSchemaParse: any) {
        if (jsonSchemaParse?.offers) {
            this.jsonSchemaCalc(jsonSchemaParse)
        } else if (Array.isArray(jsonSchemaParse) && jsonSchemaParse.length) {
            for (let i = 0; i < jsonSchemaParse.length; i++) {
                this.jsonSchemaCalc(jsonSchemaParse[i])
            }
        }
    }

    jsonSchemaCalc(jsonSchemaParse: any) {
        if (jsonSchemaParse?.offers?.offers) {
            this.offerCalc(jsonSchemaParse?.offers)
            return
        }
        if (jsonSchemaParse?.offers?.availability?.toLowerCase()?.includes('instock')) {
            this.setAvailability(true)
            if (
                jsonSchemaParse?.offers?.itemCondition?.toLowerCase()?.includes('used') ||
                jsonSchemaParse?.offers?.itemCondition?.toLowerCase()?.includes('preorder') ||
                jsonSchemaParse?.offers?.itemCondition?.toLowerCase()?.includes('pre-order')
            ) {
                this.setAvailability(false)
            }
        } else if (Array.isArray(jsonSchemaParse?.offers)) {
            for (let i = 0; i < jsonSchemaParse?.offers.length; i++) {
                if (jsonSchemaParse?.offers[i]?.availability?.toLowerCase()?.includes('instock')) {
                    this.setAvailability(true)
                }
                if (
                    jsonSchemaParse?.offers[i]?.itemCondition?.toLowerCase()?.includes('used') ||
                    jsonSchemaParse?.offers[i]?.itemCondition?.toLowerCase()?.includes('preorder') ||
                    jsonSchemaParse?.offers[i]?.itemCondition?.toLowerCase()?.includes('pre-order')
                ) {
                    this.setAvailability(false)
                    continue
                }
            }
        }
    }

    async priceCalculate(): Promise<void> {
        return Promise.resolve(undefined)
    }

    protected async checkPriceBySchemas(selector: string, options = {}): Promise<void> {
        const newOption = {
            timeout: 10000,
            ...options,
        }
        try {
            await this.page.waitForSelector(selector, newOption)
            const jsonSchemas = await this.page.$$eval(selector, (elem) =>
                elem.map((el) => el.textContent?.trim().replace(';', ''))
            )
            this.iteratePriceSchemas(jsonSchemas)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }

    private iteratePriceSchemas(jsonSchemas: any[]) {
        for (let i = 0; i < jsonSchemas.length; i++) {
            let jsonSchemaParse = jsonSchemas[i]
            jsonSchemaParse = typeof jsonSchemas[i] === 'string' ? JSON.parse(jsonSchemas[i] as string) : jsonSchemas[i]
            if (jsonSchemaParse?.mainEntity) {
                jsonSchemaParse = jsonSchemaParse?.mainEntity
            } else if (jsonSchemaParse?.productLdJson) {
                jsonSchemaParse = jsonSchemaParse?.productLdJson
            } else if (jsonSchemaParse?.['@graph']) {
                this.iteratePriceSchemas(jsonSchemaParse?.['@graph'])
                return
            } else if (jsonSchemaParse?.['@type'] === 'ItemList' && jsonSchemaParse.itemListElement) {
                this.iteratePriceSchemas([jsonSchemaParse.itemListElement[0].item])
                return
            }
            this.priceCalc(jsonSchemaParse)
        }
    }

    priceCalc(jsonSchemaParse: any) {
        if (jsonSchemaParse?.offers) {
            if (jsonSchemaParse?.offers?.offers) {
                this.priceCalc(jsonSchemaParse?.offers)
                return
            }
            if (jsonSchemaParse?.offers?.price) {
                this.setPrice(jsonSchemaParse?.offers?.price)
            } else if (jsonSchemaParse?.offers?.highPrice) {
                this.setPrice(jsonSchemaParse?.offers?.highPrice)
            } else if (jsonSchemaParse?.offers?.lowPrice) {
                this.setPrice(jsonSchemaParse?.offers?.lowPrice)
            } else if (Array.isArray(jsonSchemaParse?.offers) && jsonSchemaParse?.offers?.length) {
                if (jsonSchemaParse?.offers[0].price) {
                    this.setPrice(jsonSchemaParse?.offers[0].price)
                } else if (jsonSchemaParse?.offers[0].highPrice) {
                    this.setPrice(jsonSchemaParse?.offers[0].highPrice)
                } else if (jsonSchemaParse?.offers[0].lowPrice) {
                    this.setPrice(jsonSchemaParse?.offers[0].lowPrice)
                }
            }
        } else if (Array.isArray(jsonSchemaParse) && jsonSchemaParse.length) {
            for (let i = 0; i < jsonSchemaParse.length; i++) {
                if (jsonSchemaParse[i]?.offers) {
                    if (jsonSchemaParse[i]?.offers?.price) {
                        this.setPrice(jsonSchemaParse[i]?.offers?.price)
                    } else if (Array.isArray(jsonSchemaParse[0]?.offers)) {
                        if (jsonSchemaParse[i]?.offers[0].price) {
                            this.setPrice(jsonSchemaParse[i]?.offers[0].price)
                        } else if (jsonSchemaParse[i]?.offers[0].lowPrice) {
                            this.setPrice(jsonSchemaParse[i]?.offers[0].lowPrice)
                        } else if (jsonSchemaParse[i]?.offers[0].highPrice) {
                            this.setPrice(jsonSchemaParse[i]?.offers[0].highPrice)
                        }
                    }
                }
            }
        }
    }

    productIsExist(): boolean {
        return this.productExist
    }

    async scrapeWholeSite(): Promise<void> {
        for (let i = 0; i < this.categoriesUrl.length; i++) {
            await this.pageNav(i)
        }
    }

    private async pageNav(index: number): Promise<void> {
        await this.page.goto(this.categoriesUrl[index], { waitUntil: 'load' })

        // Scroll
        await this.scrollDown()

        // Next Page

        /*if (await this.hasNextPage()) {
        }*/
    }
}

export default Store
