import {Page} from "puppeteer";
import IStore from "./IStore";
import {TypePriceSelector, TypePriceSelectors} from "../@types/TypePriceSelectors";
import Objectt from "../lib/Object";
import Url from "../lib/Url";
import {textToNumber} from "../lib/helper";
import sleep from "../utils/sleep";
import ISelectors from "./ISelectors";
import CssSelectors from "./CssSelectors";
import IStoreOptions from "./IStoreOptions";
import StoreOptions from "./StoreOptions";
import IProductDetails from "./IProductDetails";
import {EnumLoadType} from "../@types/EnumLoadType";

abstract class Store implements IStore, IProductDetails {
    protected page: Page
    protected url: string
    protected pageParam: string = 'page'
    protected categoriesUrl: string[] = []
    protected addToCartBtnContent: string = ''
    protected availability: boolean = false
    protected isScrollDown: boolean = false
    protected price: number = NaN
    protected selectorsPrice: TypePriceSelectors = {}
    private readonly selectorsP: ISelectors
    private readonly optionsP: IStoreOptions
    protected loadType: EnumLoadType = EnumLoadType.LOAD
    protected productExist: boolean = true
    protected siteIsBlocked: boolean = false

    protected constructor(page: Page, url: string) {
        this.page = page
        this.url = url
        this.selectorsP = new CssSelectors()
        this.optionsP = new StoreOptions()
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
        return this.url;
    }

    private async fetchPrice() {
        if (Objectt.isEmpty(this.getPriceSelectors())) {
            throw new Error(`Please set selectors for domain ${this.getDomain()}`)
        }

        for (const [key, value] of Object.entries(this.getPriceSelectors())) {
            try {
                await this.page.waitForSelector(value.selector, {timeout: 5000})
                if (value.attr === 'text') {
                    this.setPrice(
                        textToNumber(await this.page.$eval(value.selector, elem => elem.textContent))
                    )
                } else {
                    let attr: string = value.attr
                    this.setPrice(
                        textToNumber(
                            await this.page.$eval(
                                value.selector,
                                (elem, _attr) => typeof _attr === "string" ? elem.getAttribute(_attr) : '',
                                attr
                            )
                        )
                    )
                }
                break;
            } catch (e: any) {
                console.log(`Not Found Price in ${this.getUrl()} with selector: ${value.selector} and Attribute: ${value.attr}`)
                console.log(e.message)
            }
        }
    }

    async scrape(): Promise<void> {
        let url = this.getUrl();

        let scrapUrl = "https://api.scraperapi.com/?api_key=4bd0f31c8a7cb7c2dbd60e8b7e79c9f3&country_code=us&url=" + url
        switch (this.getDomain()) {
            case "walmart":
                url = scrapUrl
            break
            case "boxed":
                url = url = scrapUrl
            break
            case "wayfair":
                url = url = scrapUrl
            break
            case "knifecenter":
                url = url = scrapUrl
            break
            case "pharmaca":
                url = url = scrapUrl
            break
            case "macys":
                url = url = scrapUrl
            break
            case "acmetools":
                url = url = scrapUrl
            break
            case "colourpop":
                url = url = scrapUrl
            break
            case "bestbuy":
                url = url = scrapUrl
            break
            case "gamestop":
                url = url = scrapUrl
            break
            case "dillards":
                url = url = scrapUrl
            break
            case "partycity":
                url = url = scrapUrl
            break
            case "nordstrom":
                url = url = scrapUrl
            break
            case "insanetoyshop":
                url = url = scrapUrl
            break
            case "musiciansfriend":
                url = url = scrapUrl
            break
            default:
                url = this.getUrl()
        }

        if (this.siteIsBlocked) {
            url = scrapUrl
        }

        await this.page.goto(url, {timeout: 100000, waitUntil: this.loadType})
        await this.availibilityCalculate()
        await this.priceCalculate()

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
        });

        for (let i = 0; i < pageHeight; i = i + 100) {
            await this.page.mouse.wheel({deltaY: i})
            await sleep(500)
        }
        return true
    }
    protected hasNextPage = async (): Promise<boolean> => {
        if (!this.selectors().getNextPage()) return false

        try {
            await this.page.waitForSelector(this.selectors().getNextPage(), {timeout: 5000})
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
        return this;
    }

    getPageParam(): string {
        return this.pageParam;
    }

    getAddToCartBtnContent(): string {
        return this.addToCartBtnContent;
    }

    async availibilityCalculate(): Promise<void> {
        return Promise.resolve(undefined);
    }

    protected async checkAvailibilityBySchemas(selector: string): Promise<void> {
        try {
            await this.page.waitForSelector(selector, {timeout: 10000})
            const jsonSchemas = await this.page.$$eval(selector, elem => elem.map(el => el.textContent?.trim().replace(';', '')))

             this.iterateAvalabilitySchemas(jsonSchemas)

        } catch (e: any) {
            console.log(e.message)
            this.productExist = false
            this.setAvailability(false)
        }
    }

    private iterateAvalabilitySchemas(jsonSchemas: any[]) {
        for (let i = 0; i < jsonSchemas.length; i++) {
            let jsonSchemaParse = jsonSchemas[i]

            jsonSchemaParse = (typeof jsonSchemas[i] === 'string') ? JSON.parse(<string>jsonSchemas[i]) : jsonSchemas[i]
            if (jsonSchemaParse?.mainEntity) {
                jsonSchemaParse = jsonSchemaParse?.mainEntity
            } else if (jsonSchemaParse?.productLdJson) {
                jsonSchemaParse = jsonSchemaParse?.productLdJson
            } else if (jsonSchemaParse?.['@graph']) {
                this.iterateAvalabilitySchemas(jsonSchemaParse?.['@graph'])
                return
            } else if (jsonSchemaParse?.['@type'] === "ItemList" && jsonSchemaParse?.['itemListElement']) {
                this.iterateAvalabilitySchemas([jsonSchemaParse?.['itemListElement'][0]['item']])
                return
            }
            this.offerCalc(jsonSchemaParse)
        }
    }

    offerCalc(jsonSchemaParse: any) {
        if (jsonSchemaParse?.offers) {
            if (jsonSchemaParse?.offers?.offers) {
                this.offerCalc(jsonSchemaParse?.offers)
                return
            }
            if (jsonSchemaParse?.offers?.availability === 'https://schema.org/InStock' ||
                jsonSchemaParse?.offers?.availability === 'http://schema.org/InStock' ||
                jsonSchemaParse?.offers?.availability === 'https://www.schema.org/InStock' ||
                jsonSchemaParse?.offers?.availability === 'http://www.schema.org/InStock' ||
                jsonSchemaParse?.offers?.availability === 'InStock' ||
                jsonSchemaParse?.offers?.availability === 'instock'
            ) {
                this.setAvailability(true)
            } else if (Array.isArray(jsonSchemaParse?.offers)) {
                if (jsonSchemaParse?.offers[0]['availability'] === 'https://schema.org/InStock' ||
                    jsonSchemaParse?.offers[0]['availability'] === 'http://schema.org/InStock' ||
                    jsonSchemaParse?.offers[0]['availability'] === 'https://www.schema.org/InStock' ||
                    jsonSchemaParse?.offers[0]['availability'] === 'http://www.schema.org/InStock' ||
                    jsonSchemaParse?.offers[0]['availability'] === 'InStock' ||
                    jsonSchemaParse?.offers[0]['availability'] === 'instock'
                ) {
                    this.setAvailability(true)
                }
            }
        } else if (Array.isArray(jsonSchemaParse) && jsonSchemaParse.length) {
            for (let i = 0; i < jsonSchemaParse.length; i++) {
                if (jsonSchemaParse[i]?.offers) {
                    if (jsonSchemaParse[i]?.offers?.availability === 'https://schema.org/InStock' ||
                        jsonSchemaParse[i]?.offers?.availability === 'http://schema.org/InStock' ||
                        jsonSchemaParse[i]?.offers?.availability === 'https://www.schema.org/InStock' ||
                        jsonSchemaParse[i]?.offers?.availability === 'http://www.schema.org/InStock' ||
                        jsonSchemaParse[i]?.offers?.availability === 'InStock' ||
                        jsonSchemaParse[i]?.offers?.availability === 'instock'
                    ) {
                        this.setAvailability(true)
                    } else if (Array.isArray(jsonSchemaParse[0]?.offers)) {
                        if (jsonSchemaParse[i]?.offers[0]['availability'] === 'https://schema.org/InStock' ||
                            jsonSchemaParse[i]?.offers[0]['availability'] === 'http://schema.org/InStock' ||
                            jsonSchemaParse[i]?.offers[0]['availability'] === 'https://www.schema.org/InStock' ||
                            jsonSchemaParse[i]?.offers[0]['availability'] === 'http://www.schema.org/InStock' ||
                            jsonSchemaParse[i]?.offers[0]['availability'] === 'InStock' ||
                            jsonSchemaParse[i]?.offers[0]['availability'] === 'instock'
                        ) {
                            this.setAvailability(true)
                        }
                    }
                }
            }
        }
    }

    async priceCalculate(): Promise<void> {
        return Promise.resolve(undefined);
    }

    protected async checkPriceBySchemas(selector: string): Promise<void> {
        try {
            await this.page.waitForSelector(selector, {timeout: 10000})
            const jsonSchemas = await this.page.$$eval(selector, elem => elem.map(el => el.textContent?.trim().replace(';', '')))
            this.iteratePriceSchemas(jsonSchemas)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }

    private iteratePriceSchemas(jsonSchemas: any[]) {
        for (let i = 0; i < jsonSchemas.length; i++) {
            let jsonSchemaParse = jsonSchemas[i]
            jsonSchemaParse = (typeof jsonSchemas[i] === 'string') ? JSON.parse(<string>jsonSchemas[i]) : jsonSchemas[i]
            if (jsonSchemaParse?.mainEntity) {
                jsonSchemaParse = jsonSchemaParse?.mainEntity
            } else if (jsonSchemaParse?.productLdJson) {
                jsonSchemaParse = jsonSchemaParse?.productLdJson
            } else if (jsonSchemaParse?.['@graph']) {
                this.iteratePriceSchemas(jsonSchemaParse?.['@graph'])
                return
            } else if (jsonSchemaParse?.['@type'] === "ItemList" && jsonSchemaParse?.['itemListElement']) {
                this.iteratePriceSchemas([jsonSchemaParse?.['itemListElement'][0]['item']])
                return
            }
            this.priceCalc(jsonSchemaParse)
        }
    }

    priceCalc(jsonSchemaParse: any) {
        if (jsonSchemaParse?.offers) {
            if (jsonSchemaParse?.offers?.offers) {
                this.priceCalc(jsonSchemaParse?.offers)
                return;
            }
            if (jsonSchemaParse?.offers?.price) {
                this.setPrice(jsonSchemaParse?.offers?.price)
            } else if (Array.isArray(jsonSchemaParse?.offers) && jsonSchemaParse?.offers?.length) {
                if (jsonSchemaParse?.offers[0]['price']) {
                    this.setPrice(jsonSchemaParse?.offers[0]['price'])
                }
            }
        } else if (Array.isArray(jsonSchemaParse) && jsonSchemaParse.length) {
            for (let i = 0; i < jsonSchemaParse.length; i++) {
                if (jsonSchemaParse[i]?.offers) {
                    if (jsonSchemaParse[i]?.offers?.price) {
                        this.setPrice(jsonSchemaParse[i]?.offers?.price)
                    } else if (Array.isArray(jsonSchemaParse[0]?.offers)) {
                        if (jsonSchemaParse[i]?.offers[0]['price']) {
                            this.setPrice(jsonSchemaParse[i]?.offers[0]['price'])
                        }
                    }
                }
            }
        }
    }

    productIsExist(): boolean {
        return this.productExist
    }
}

export default Store