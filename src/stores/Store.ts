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
import StoreSchema from '../lib/StoreSchema'
import { textToNumber } from '../lib/helper'
import { cat } from 'shelljs'

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
    public error = ''
    protected selectorsPrice: TypePriceSelectors = {}
    private readonly selectorsP: ISelectors
    private readonly optionsP: IStoreOptions
    protected loadType: EnumLoadType = EnumLoadType.LOAD
    protected productExist = true
    protected siteIsBlocked = false
    protected runPostman = false
    protected viewPageSource = true
    protected isSecond = false

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

    async createBrowser(siteIsBlocked = false): Promise<void> {
        try {
            const pup = new MyPuppeteer(siteIsBlocked)
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

    async setCanonical(): Promise<void> {
        try {
            let canonical: string | undefined
            const selector = 'link[rel="canonical"]'
            if (this.runPostman) {
                canonical = this.resultReq.$(selector).attr('href')
            } else {
                await this.page.waitForSelector(selector, { timeout: 2000 })
                canonical = await this.page.$eval(selector, (elem: any) => elem.getAttribute('href'))
            }

            if (canonical) {
                this.url = canonical
            }
        } catch (e: any) {
            console.log('Not exist canonical')
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
            if (this.viewPageSource && (isBan || this.runPostman)) {
                console.log('>>>> Site is Ban')
                this.runPostman = true
                this.resultReq = await MyPostmanRequest.request(this.getUrl(), true)
            } else {
                const res = await this.page.goto(this.getUrl(), { timeout: 180000, waitUntil: this.loadType })
                this.statusCode = res?.status()
                console.log('>>>> Status Code = ' + res?.status())
                if (res?.status() !== 200 && res?.status() !== 404 && this.viewPageSource) {
                    this.runPostman = true
                    this.resultReq = await MyPostmanRequest.request(this.getUrl(), true)
                } else if (res?.status() === 404) {
                    throw new Error('Error 404')
                }
            }
        } catch (e: any) {
            await this.browser.close()
            return
        }

        if (!this.isSecond) {
            await this.productExistCalculate()
        }

        if (!this.productExist) {
            this.error = 'Product Not Exist'
        }

        if (!this.productExist && !this.viewPageSource && !this.isSecond && this.statusCode !== 404) {
            try {
                this.isSecond = true
                this.productExist = true
                console.log('viewPageSource : false')
                try {
                    await this.browser.close()
                } catch (e: any) {
                    console.log(e.message)
                }
                await this.createBrowser(true)
                await this.scrape()
                return
            } catch (e: any) {
                console.log(e.message)
            }
        }

        if (!this.productExist && this.viewPageSource && !this.isSecond) {
            this.isSecond = true
            this.productExist = true
            await this.scrape(true)
            return
        }

        await this.setCanonical()
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

    async checkAvailability(input: { selector: string; render: string | null; outputArray: string[] | undefined }) {
        try {
            const output: string[] = ['add to cart', 'add-to-cart', 'instock', 'in stock']
            if (input.outputArray) {
                output.concat(input.outputArray)
            }
            let availability: string | undefined

            if (this.runPostman) {
                if (input.render === 'text') {
                    availability = this.resultReq.$(input.selector).text()
                } else if (input.render === 'content') {
                    availability = this.resultReq.$(input.selector).attr('content')
                } else if (input.render === 'href') {
                    availability = this.resultReq.$(input.selector).attr('href')
                } else if (!input.render) {
                    if (this.resultReq.$(input.selector)) {
                        availability = 'in stock'
                    } else {
                        availability = 'out of stock'
                    }
                }
            } else {
                await this.page.waitForSelector(input.selector, { timeout: 10000 })
                if (input.render === 'text') {
                    availability = await this.page.$eval(input.selector, (elem: any) => elem.textContent)
                } else if (input.render === 'content') {
                    availability = await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('content'))
                } else if (input.render === 'href') {
                    availability = await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('href'))
                } else if (!input.render) {
                    try {
                        await this.page.waitForSelector(input.selector, { timeout: 10000 })
                        availability = 'in stock'
                    } catch (e) {
                        availability = 'out of stock'
                    }
                }
            }
            for (let i = 0; i < output.length; i++) {
                if (availability?.toLowerCase().trim().includes(output[i])) {
                    this.setAvailability(true)
                    break
                }
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async checkPrice(input: { selector1: string; selector2?: string | undefined; render: string }) {
        try {
            await this.checkPriceRender({ selector: input.selector1, render: input.render })

            if (!this.getPrice() && input.selector2) {
                await this.checkPriceRender({ selector: input.selector2, render: input.render })
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    private async checkPriceRender(input: { selector: string; render: string }) {
        try {
            if (this.runPostman) {
                if (input.render === 'text') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).text()))
                } else if (input.render === 'content') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).attr('content')))
                } else if (input.render === 'data-price-amount') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).attr('data-price-amount')))
                }
            } else {
                await this.page.waitForSelector(input.selector, { timeout: 10000 })
                if (input.render === 'text') {
                    this.setPrice(textToNumber(await this.page.$eval(input.selector, (elem: any) => elem.textContent)))
                } else if (input.render === 'content') {
                    this.setPrice(
                        textToNumber(await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('content')))
                    )
                } else if (input.render === 'data-price-amount') {
                    this.setPrice(
                        textToNumber(
                            await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-price-amount'))
                        )
                    )
                }
            }
        } catch (e) {
            this.setPrice(NaN)
        }
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

    protected async productExistBySelector(selector: string) {
        if (this.runPostman) {
            if (!this.resultReq.$(selector).length) {
                this.productExist = false
            }
        } else {
            try {
                await this.page.waitForSelector(selector)
                this.productExist = true
            } catch (e: any) {
                console.log(e.message)
                this.productExist = false
            }
        }
    }

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
            const jsonSchemas = await this.fetchJsonSchemas(selector, newOption)

            new StoreSchema(jsonSchemas)
            this.iterateAvalabilitySchemas(jsonSchemas)
        } catch (e: any) {
            console.log(e.message)
            this.setAvailability(false)
        }
    }

    protected async checkMetaByClassSchemas(selector: string, options = {}): Promise<void> {
        const newOption = {
            timeout: 10000,
            ...options,
        }
        try {
            const jsonSchemas = await this.fetchJsonSchemas(selector, newOption)

            const storeSchema = new StoreSchema(jsonSchemas)
            this.setPrice(storeSchema.price)
            this.setAvailability(storeSchema.availability)
        } catch (e: any) {
            console.log(e.message)
            this.setAvailability(false)
        }
    }

    private async fetchJsonSchemas(selector: string, newOption = {}) {
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
                console.log(e.message)
                // await this.scrape(true)
            }
        }

        return jsonSchemas
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
