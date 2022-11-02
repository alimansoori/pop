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
import { MyPuppeteer } from '../lib/MyPuppeteer'
import MyPostmanRequest from '../lib/MyPostmanRequest'
import * as cheerio from 'cheerio'
import { TypePostmanReq } from '../@types/TypePostmanReq'
import { Browser, Page } from 'puppeteer'

abstract class Store implements IStore, IProductDetails {
    titleClass: ProductTitle
    protected page!: Page
    protected browser!: Browser
    protected resultReq: TypePostmanReq
    protected url: string
    public statusCode: number | undefined = 200
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
    protected runPostman = false

    protected constructor(url: string) {
        this.url = url
        this.selectorsP = new CssSelectors()
        this.optionsP = new StoreOptions()
        this.titleClass = new ProductTitle()
        this.resultReq = {
            $: cheerio.load(''),
            headers: {},
            error: true,
        }
    }

    async createBrowser(): Promise<void> {
        try {
            const pup = new MyPuppeteer(this.siteIsBlocked)
            await pup.build()
            this.browser = pup.browser
            this.page = await this.browser.newPage()
        } catch (e) {
            throw new Error('create browser faild')
        }
    }

    getTitleClass(): ProductTitle {
        return this.titleClass
    }

    selectors(): ISelectors {
        return this.selectorsP
    }

    setCanonical(): void {
        const canonical = this.resultReq.$('link[rel="canonical"]').attr('href')
        if (!this.runPostman && canonical) {
            this.url = canonical
        }
    }

    setTitle(): void {
        const title = this.resultReq.$('title').text()
        if (!this.runPostman && title) {
            this.titleClass.setTitle(title.trim())
        }
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

    async scrape(isBan = false): Promise<void> {
        try {
            if (isBan) {
                console.log('>>>> Site is Ban')
                this.runPostman = true
                this.resultReq = await MyPostmanRequest.request(this.getUrl(), true)
            } else {
                const res = await this.page.goto(this.getUrl(), { timeout: 180000, waitUntil: this.loadType })
                this.statusCode = res?.status()
                console.log('>>>> Status Code = ' + res?.status())
                if (res?.status() !== 200 || res?.status() !== 404) {
                    this.runPostman = true
                    this.resultReq = await MyPostmanRequest.request(this.getUrl(), true)
                }
            }
        } catch (e: any) {
            await this.browser.close()
        }

        await this.productExistCalculate()
        this.setCanonical()
        this.setTitle()
        if (!this.titleClass.isValid()) {
            console.log('Product title not valid!')
        }
        if (this.productIsExist() && this.titleClass.isValid()) {
            await this.productTitleCalculate()
            await this.availibilityCalculate()
            await this.priceCalculate()
        }

        await this.browser.close()

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
            let jsonSchemas: any[] = []
            if (this.runPostman) {
                this.resultReq.$(selector).map((num, elem) => {
                    jsonSchemas.push(this.resultReq.$(elem).text())
                })
            } else {
                try {
                    await this.page.waitForSelector(selector, newOption)
                    jsonSchemas = await this.page.$$eval(selector, (elem: any) =>
                        elem.map((el: any) => el.textContent?.trim().replace(';', ''))
                    )
                } catch (e: any) {
                    await this.scrape(true)
                }
            }

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
        if (jsonSchemaParse?.offers || jsonSchemaParse?.Offers) {
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
        } else if (jsonSchemaParse?.Offers?.Offers) {
            this.offerCalc(jsonSchemaParse?.Offers)
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

        if (jsonSchemaParse?.Offers?.availability?.toLowerCase()?.includes('instock')) {
            this.setAvailability(true)
            if (
                jsonSchemaParse?.Offers?.itemCondition?.toLowerCase()?.includes('used') ||
                jsonSchemaParse?.Offers?.itemCondition?.toLowerCase()?.includes('preorder') ||
                jsonSchemaParse?.Offers?.itemCondition?.toLowerCase()?.includes('pre-order')
            ) {
                this.setAvailability(false)
            }
        } else if (Array.isArray(jsonSchemaParse?.Offers)) {
            for (let i = 0; i < jsonSchemaParse?.Offers.length; i++) {
                if (jsonSchemaParse?.Offers[i]?.availability?.toLowerCase()?.includes('instock')) {
                    this.setAvailability(true)
                }
                if (
                    jsonSchemaParse?.Offers[i]?.itemCondition?.toLowerCase()?.includes('used') ||
                    jsonSchemaParse?.Offers[i]?.itemCondition?.toLowerCase()?.includes('preorder') ||
                    jsonSchemaParse?.Offers[i]?.itemCondition?.toLowerCase()?.includes('pre-order')
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
            let jsonSchemas: any[] = []
            if (this.runPostman) {
                this.resultReq.$(selector).map((num, elem) => {
                    jsonSchemas.push(this.resultReq.$(elem).text())
                })
            } else {
                await this.page.waitForSelector(selector, newOption)
                jsonSchemas = await this.page.$$eval(selector, (elem: any) =>
                    elem.map((el: any) => el.textContent?.trim().replace(';', ''))
                )
            }

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

        if (jsonSchemaParse?.Offers) {
            if (jsonSchemaParse?.Offers?.Offers) {
                this.priceCalc(jsonSchemaParse?.Offers)
                return
            }
            if (jsonSchemaParse?.Offers?.price) {
                this.setPrice(jsonSchemaParse?.Offers?.price)
            } else if (jsonSchemaParse?.Offers?.highPrice) {
                this.setPrice(jsonSchemaParse?.Offers?.highPrice)
            } else if (jsonSchemaParse?.Offers?.lowPrice) {
                this.setPrice(jsonSchemaParse?.Offers?.lowPrice)
            } else if (Array.isArray(jsonSchemaParse?.Offers) && jsonSchemaParse?.Offers?.length) {
                if (jsonSchemaParse?.Offers[0].price) {
                    this.setPrice(jsonSchemaParse?.Offers[0].price)
                } else if (jsonSchemaParse?.Offers[0].highPrice) {
                    this.setPrice(jsonSchemaParse?.Offers[0].highPrice)
                } else if (jsonSchemaParse?.Offers[0].lowPrice) {
                    this.setPrice(jsonSchemaParse?.Offers[0].lowPrice)
                }
            }
        } else if (Array.isArray(jsonSchemaParse) && jsonSchemaParse.length) {
            for (let i = 0; i < jsonSchemaParse.length; i++) {
                if (jsonSchemaParse[i]?.Offers) {
                    if (jsonSchemaParse[i]?.Offers?.price) {
                        this.setPrice(jsonSchemaParse[i]?.Offers?.price)
                    } else if (Array.isArray(jsonSchemaParse[0]?.Offers)) {
                        if (jsonSchemaParse[i]?.Offers[0].price) {
                            this.setPrice(jsonSchemaParse[i]?.Offers[0].price)
                        } else if (jsonSchemaParse[i]?.Offers[0].lowPrice) {
                            this.setPrice(jsonSchemaParse[i]?.Offers[0].lowPrice)
                        } else if (jsonSchemaParse[i]?.Offers[0].highPrice) {
                            this.setPrice(jsonSchemaParse[i]?.Offers[0].highPrice)
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
