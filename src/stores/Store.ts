import IStore from './IStore'
import { TypePriceSelector, TypePriceSelectors } from '../@types/TypePriceSelectors'
import Url from '../lib/Url'
import { sleep } from '../utils/sleep'
import ISelectors from './ISelectors'
import CssSelectors from './CssSelectors'
import IStoreOptions from './IStoreOptions'
import StoreOptions from './StoreOptions'
import IProductDetails from './IProductDetails'
import { EnumLoadType } from '../@types/EnumLoadType'
import ProductTitle from './ProductTitle'
import { MyPuppeteer } from '../lib/MyPuppeteer'
import * as cheerio from 'cheerio'
import { TypePostmanReq } from '../@types/TypePostmanReq'
import { Browser, Page } from 'puppeteer'
import StoreSchema from '../lib/StoreSchema'
import { textToNumber } from '../lib/helper'
import fs from 'fs'
import { EnumSelectorOrContent } from '../@types/EnumSelectorOrContent'
import { MyPuppeteerCalculate } from '../lib/MyPuppeteerCalculate'

abstract class Store implements IStore, IProductDetails {
    titleClass: ProductTitle
    protected page!: Page
    browser!: Browser
    protected resultReq: TypePostmanReq
    protected url: string
    protected originUrl: string
    public statusCode: number | undefined = 200
    protected pageParam = 'page'
    protected categoriesUrl: string[] = []
    protected addToCartBtnContent = ''
    protected availability = false
    protected isScrollDown = false
    protected price = NaN
    private image: string[] = []
    private upc: string | undefined
    public error = ''
    protected selectorsPrice: TypePriceSelectors = {}
    private readonly selectorsP: ISelectors
    private readonly optionsP: IStoreOptions
    protected loadType: EnumLoadType = EnumLoadType.LOAD
    protected productExist = true
    protected pageNotFound = false
    protected siteIsBlocked = false
    protected headlessRun = false
    protected viewPageSource = true
    protected isSecond = false
    protected scrapUntilBlock = false
    protected enableAssets = false
    protected enableCanonical = true
    protected includeAssets: (RegExp | string)[] = []
    protected excludeAssets: (RegExp | string)[] = []
    protected config: IPuppeteerConfig

    protected constructor(url: string) {
        this.config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
        this.url = url
        this.originUrl = url
        this.selectorsP = new CssSelectors()
        this.optionsP = new StoreOptions()
        this.titleClass = new ProductTitle()
        this.resultReq = {
            $: cheerio.load(''),
            headers: {},
            body: '',
            error: true,
        }
    }

    async createBrowser(siteIsBlocked = false): Promise<void> {
        try {
            if (this.isSecond) {
                siteIsBlocked = true
            }
            const pup = new MyPuppeteer(!this.isSecond ? false : this.headlessRun, siteIsBlocked)
            await pup.build()
            this.browser = pup.browser
            this.page = await this.browser.newPage()

            await this.page.setViewport({ width: 1980, height: 1080 })
            // this.page = (await this.browser.pages())[0]

            await this.page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'
            )

            // const cookiesSet = await this.page.cookies(this.getUrl())
            // console.log(JSON.stringify(cookiesSet))

            if (!this.enableAssets) {
                await this.page.setRequestInterception(true)
                this.page.on('request', (req: any) => {
                    if (req?._url?.match(/^.*\.ico/)) {
                        req.abort()
                    } else if (req.resourceType() === 'document' || req.resourceType() === 'xhr') {
                        // console.log('<<< Asset is match def >>>')
                        req.continue()
                    } else if (
                        req.resourceType() === 'stylesheet' ||
                        req.resourceType() === 'font' ||
                        req.resourceType() === 'image'
                    ) {
                        req.abort()
                    } else {
                        if (!this.isSecond) {
                            req.continue()
                        } else if (this.isSecond) {
                            if (!this.excludeAssets.length) {
                                req.abort()
                            } else {
                                console.log(req._url)
                                console.log(req.resourceType())
                                let exit = false
                                for (const patternAsset of this.excludeAssets) {
                                    if (req._url.match(patternAsset)) {
                                        console.log('<<< Asset is exclude >>>')
                                        exit = true
                                        req.abort()
                                        break
                                    }
                                }
                                if (!exit) {
                                    // console.log('<<< Continue >>>')
                                    req.continue()
                                }
                            }
                        } else {
                            req.abort()
                        }
                    }
                })
            }
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
            if (this.productExist) {
                if (this.headlessRun) {
                    canonical = this.resultReq.$(selector).attr('href')
                } else {
                    await this.page.waitForSelector(selector, { timeout: 2000 })
                    canonical = await this.page.$eval(selector, (elem: any) => elem.getAttribute('href'))
                }
            }

            if (canonical) {
                this.url = canonical
            }
        } catch (e: any) {
            console.log('Not exist canonical')
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

    async setTitle(input: { selector: string; render: string; timeout?: number | undefined }) {
        try {
            await this.checkTitleRender(input)
        } catch (e: any) {
            this.getTitleClass().setTitle('')
        }
    }

    private async checkTitleRender(input: { selector: string; render: string; timeout?: number | undefined }) {
        if (!input.timeout) input.timeout = 10000
        try {
            if (this.headlessRun) {
                if (input.render === 'text') {
                    this.getTitleClass().setTitle(this.resultReq.$(input.selector).text())
                } else if (input.render === 'content') {
                    this.getTitleClass().setTitle(this.resultReq.$(input.selector).attr('content'))
                } else if (input.render === 'data-price-amount') {
                    this.getTitleClass().setTitle(this.resultReq.$(input.selector).attr('data-price-amount'))
                } else if (input.render === 'data-price') {
                    this.getTitleClass().setTitle(this.resultReq.$(input.selector).attr('data-price'))
                }
            } else {
                await this.page.waitForSelector(input.selector, { timeout: input.timeout })
                if (input.render === 'text') {
                    this.getTitleClass().setTitle(
                        await this.page.$eval(input.selector, (elem: any) => elem.textContent)
                    )
                } else if (input.render === 'content') {
                    this.getTitleClass().setTitle(
                        await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('content'))
                    )
                } else if (input.render === 'data-price-amount') {
                    this.getTitleClass().setTitle(
                        await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-price-amount'))
                    )
                } else if (input.render === 'data-price') {
                    this.getTitleClass().setTitle(
                        await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-price'))
                    )
                }
            }
        } catch (e) {
            this.getTitleClass().setTitle('')
        }
    }

    async setImage(input: { selector: string; render: string; type?: string; multiple?: boolean }) {
        try {
            await this.checkImageRender(input)
        } catch (e: any) {
            console.error(e.message)
        }
    }

    private async checkImageRender(input: { selector: string; render: string; type?: string; multiple?: boolean }) {
        try {
            if (input.type === 'regex') {
                await this.getRegexImage(input)
            } else if (input.render === 'text') {
                await this.getTextImage(input)
            } else if (input.render === 'content') {
                await this.getContentImage(input)
            } else if (input.render === 'data-price-amount') {
                await this.getDataPriceAmountImage(input)
            } else if (input.render === 'data-price') {
                await this.getDataPriceImage(input)
            } else if (input.render === 'href') {
                await this.getHrefImage(input)
            } else if (input.render === 'src') {
                await this.getSrcImage(input)
            } else if (input.render === 'data-src') {
                await this.getDataSrcImage(input)
            } else if (input.render === 'data-thumb') {
                await this.getDataThumbImage(input)
            } else if (input.render === 'data-zoom-image') {
                await this.getDataZoomImageImage(input)
            } else if (input.render === 'data-path') {
                await this.getDataPathImage(input)
            } else if (input.render === 'data-original-src') {
                await this.getDataOriginalSrcImage(input)
            }
        } catch (e: any) {
            console.error(e.message)
        }
    }

    private async getRegexImage(input: { selector: string; render: string; type?: string; multiple?: boolean }) {
        let content = ''
        if (input.render === 'text') {
            content = await this.page.$eval(input.selector, (elem: any) => elem.textContent)
        } else if (input.render === 'data-data') {
            content = await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-data'))
        }

        const regex = /https?:.*?\.(?:png|jpe?g|svg)/g
        const urls = content?.match(regex)
        if (urls) {
            this.image = [...this.image, ...urls]
        }
    }

    private async getTextImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = [
                    ...this.image,
                    ...$(input.selector)
                        .map(function () {
                            return $(this).text()
                        })
                        .get(),
                ]
            } else {
                this.image.push(this.resultReq.$(input.selector).text())
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems.filter((elem) => elem.textContent !== null).map((elem) => elem.textContent ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(await this.page.$eval(input.selector, (elem: any) => elem.textContent))
            }
        }
    }

    private async getContentImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = [
                    ...this.image,
                    ...$(input.selector)
                        .map(function () {
                            return $(this).attr('content')
                        })
                        .get(),
                ]
            } else {
                const attr = this.resultReq.$(input.selector).attr('content')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('content') !== null)
                        .map((elem) => elem.getAttribute('content') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('content')))
            }
        }
    }

    private async getDataPriceAmountImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('data-price-amount')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('data-price-amount')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('data-price-amount') !== null)
                        .map((elem) => elem.getAttribute('data-price-amount') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(
                    await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-price-amount'))
                )
            }
        }
    }

    private async getDataPriceImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('data-price')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('data-price')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('data-price') !== null)
                        .map((elem) => elem.getAttribute('data-price') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-price')))
            }
        }
    }

    private async getHrefImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('href')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('href')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('href') !== null)
                        .map((elem) => elem.getAttribute('href') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('href')))
            }
        }
    }

    private async getSrcImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('src')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('src')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('src') !== null)
                        .map((elem) => elem.getAttribute('src') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('src')))
            }
        }
    }

    private async getDataSrcImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('data-src')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('data-src')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('data-src') !== null)
                        .map((elem) => elem.getAttribute('data-src') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-src')))
            }
        }
    }

    private async getDataThumbImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('data-thumb')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('data-thumb')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('data-thumb') !== null)
                        .map((elem) => elem.getAttribute('data-thumb') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-thumb')))
            }
        }
    }

    private async getDataZoomImageImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('data-zoom-image')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('data-zoom-image')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('data-zoom-image') !== null)
                        .map((elem) => elem.getAttribute('data-zoom-image') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(
                    await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-zoom-image'))
                )
            }
        }
    }

    private async getDataPathImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('data-path')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('data-path')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('data-path') !== null)
                        .map((elem) => elem.getAttribute('data-path') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-path')))
            }
        }
    }

    private async getDataOriginalSrcImage(input: { selector: string; render: string; multiple?: boolean }) {
        if (this.headlessRun) {
            if (input.multiple) {
                const $ = this.resultReq.$
                this.image = $(input.selector)
                    .map(function () {
                        return $(this).attr('data-original-src')
                    })
                    .get()
            } else {
                const attr = this.resultReq.$(input.selector).attr('data-original-src')
                if (typeof attr === 'string') {
                    this.image.push(attr)
                }
            }
        } else {
            if (input.multiple) {
                const images = (await this.page.$$eval(input.selector, (elems: Element[]) => {
                    return elems
                        .filter((elem) => elem.getAttribute('data-original-src') !== null)
                        .map((elem) => elem.getAttribute('data-original-src') ?? '')
                })) as string[]
                if (images) this.image = [...this.image, ...images]
            } else {
                this.image.push(
                    await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-original-src'))
                )
            }
        }
    }

    public getImage(): string[] {
        if (!this.image.length) {
            return this.image
        }
        const newImg = []
        for (let i = 0; i < this.image.length; i++) {
            let img = this.image[i]
            const domain = this.getUrl().match(/^(?:http:\/\/|www\.|https:\/\/)([^/]+)/gim)
            if (img.match(/^(\/\/)([^/]+)/gim)) {
                img = `https:${img}`
            }
            const imgDomain = img.match(/^(?:http:\/\/|www\.|https:\/\/)([^/]+)/gim)

            if (!imgDomain && domain?.length) {
                img = domain[0] + img
            }
            newImg.push(img)
        }
        return newImg
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

    public getPageNotFound(): boolean {
        return this.pageNotFound
    }

    public setUPC(upc: string): void {
        this.upc = upc
    }

    public getUPC(): string | undefined {
        return this.upc
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

    getOriginUrl(): string {
        return this.originUrl
    }

    async scrape(isBan = false): Promise<void> {
        try {
            try {
                const pageContent = await this.page.goto(this.getUrl(), { timeout: 180000, waitUntil: this.loadType })
                this.statusCode = pageContent?.status()
                console.log('>>>> Status Code = ' + pageContent?.status())
                if (!(pageContent?.status() === 200 || pageContent?.status() === 404) && !this.isSecond) {
                    console.log('Site is Blocked!')
                    await this.runAgainPup()
                    return
                } else if (pageContent?.status() === 404) {
                    throw new Error('Error 404')
                }
            } catch (e: any) {
                this.error = e.message
                await this.browser.close()
                return
            }

            await this.productExistCalculate()

            if (!this.productExist || this.pageNotFound) {
                this.error = 'Product Not Exist OR Page Not Found'
            } else {
                this.error = ''
            }

            if (!this.productExist && !this.isSecond && !this.pageNotFound) {
                console.log('Site is Blocked!')
                await this.runAgainPup()
                return
            }

            if (this.enableCanonical && this.productExist && !this.pageNotFound) {
                await this.setCanonical()
            }

            if (!this.titleClass.isValid()) {
                console.log('Product title not valid!')
            }
            if (this.productIsExist() && this.titleClass.isValid()) {
                await this.productTitleCalculate()
                await this.productImageCalculate()
                await this.availibilityCalculate()
                await this.priceCalculate()
            }
        } catch (e: any) {
            await this.browser?.close()
        }
    }

    async runAgainPup() {
        try {
            if (!this.scrapUntilBlock) {
                console.log('Exit Block!')
                return
            }

            this.isSecond = true
            try {
                await this.browser.close()
            } catch (e: any) {
                console.log(e.message)
            }

            await this.createBrowser(true)
            await this.scrape(true)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async checkAvailability(input: { selector: string; render: string | null; outputArray?: string[] | undefined }) {
        try {
            let output: string[] = [
                'add to cart',
                'add-to-cart',
                'instock',
                'in stock',
                'available for order',
                'add to bag',
            ]
            if (input.outputArray) {
                output = output.concat(input.outputArray)
            }
            let availability: string | undefined

            if (this.headlessRun) {
                if (input.render === 'text') {
                    availability = this.resultReq.$(input.selector).text()
                } else if (input.render === 'content') {
                    availability = this.resultReq.$(input.selector).attr('content')
                } else if (input.render === 'href') {
                    availability = this.resultReq.$(input.selector).attr('href')
                } else if (input.render === 'value') {
                    availability = this.resultReq.$(input.selector).attr('value')
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
                } else if (input.render === 'value') {
                    availability = await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('value'))
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
            if (this.headlessRun) {
                if (input.render === 'text') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).text()))
                } else if (input.render === 'content') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).attr('content')))
                } else if (input.render === 'data-price-amount') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).attr('data-price-amount')))
                } else if (input.render === 'data-price') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).attr('data-price')))
                } else if (input.render === 'data-pp-amount') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).attr('data-pp-amount')))
                } else if (input.render === 'data-final-price') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).attr('data-final-price')))
                } else if (input.render === 'data-base-price') {
                    this.setPrice(textToNumber(this.resultReq.$(input.selector).attr('data-base-price')))
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
                } else if (input.render === 'data-price') {
                    this.setPrice(
                        textToNumber(
                            await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-price'))
                        )
                    )
                } else if (input.render === 'data-pp-amount') {
                    this.setPrice(
                        textToNumber(
                            await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-pp-amount'))
                        )
                    )
                } else if (input.render === 'data-final-price') {
                    this.setPrice(
                        textToNumber(
                            await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-final-price'))
                        )
                    )
                } else if (input.render === 'data-base-price') {
                    this.setPrice(
                        textToNumber(
                            await this.page.$eval(input.selector, (elem: any) => elem.getAttribute('data-base-price'))
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

    protected async productExistBySelector(selector: string, timeout?: number | undefined) {
        if (!timeout) timeout = 30000
        if (this.headlessRun) {
            if (!this.resultReq.$(selector).length) {
                this.productExist = false
            }
        } else {
            try {
                await this.page.waitForSelector(selector, { timeout })
                this.productExist = true
            } catch (e: any) {
                console.log(e.message)
                this.productExist = false
            }
        }
    }
    protected async pageNotFoundSelector(text: string, render: EnumSelectorOrContent, timeout?: number | undefined) {
        if (render === EnumSelectorOrContent.CONTENT) {
            if (await MyPuppeteerCalculate.findElementByContent(this.page, text)) {
                this.pageNotFound = true
            }
        } else {
            try {
                await this.page.waitForSelector(text, { timeout })
                this.pageNotFound = true
            } catch (e: any) {
                console.log('Page Not Found!')
                this.pageNotFound = false
            }
        }
    }

    async productTitleCalculate(): Promise<void> {
        return Promise.resolve(undefined)
    }

    async productImageCalculate(): Promise<void> {
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
            this.titleClass.setTitle(storeSchema.name ? storeSchema.name : '')
            if (!this.image.length) this.image = [...this.image, ...storeSchema.image]
            if (!this.upc) this.upc = storeSchema.upc
            this.setPrice(storeSchema.price)
            this.setAvailability(storeSchema.availability)
        } catch (e: any) {
            console.log(e.message)
            this.setAvailability(false)
        }
    }

    private async fetchJsonSchemas(selector: string, newOption = {}) {
        let jsonSchemas: any[] = []
        if (this.headlessRun) {
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
            if (this.headlessRun) {
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
