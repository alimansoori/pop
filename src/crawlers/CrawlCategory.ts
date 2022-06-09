import ICrawler from "./ICrawler";
import IStore from "../stores/IStore";
import CrawlProducts from "./CrawlProducts";
import Url from "../lib/Url";

export default class CrawlCategory implements ICrawler {
    private readonly store: IStore
    private page
    private url: string

    constructor(store: IStore, url: string) {
        this.store = store
        this.page = store.getPage()
        this.url = url
    }

    async crawl(): Promise<void> {
        try {
            await this.page.goto(this.url)
            if (!this.store.options().hasCategoryTreeNavigate()) {
                const productsPageCrawl = new CrawlProducts(this.store, this.url)
                await productsPageCrawl.crawl()
            }

            await this.page.waitForSelector(this.store.selectors().getCategoryBlock(), {timeout: 5000})
            await this.categoryNavScrape()
        } catch (e: any) {
            await this.page.waitForSelector(this.store.selectors().getCategoryProductBlock(), {timeout: 4000})
            const productsPageCrawl = new CrawlProducts(this.store, this.url)
            await productsPageCrawl.crawl()
        }
        /*try {
            if (!this.store.options().hasCategoryTreeNavigate() || !await this.categoryPageCrawl()) {
                const productsPageCrawl = new CrawlProducts(this.store, this.url)
                await productsPageCrawl.crawl()
            }
        } catch (e: any) {
            console.log('error in CrawlCategory class ' + e.message)
            console.log('wait 100000 millisecond for selector: ' + this.store.selectors().getCategoryBlock())
            await this.page.waitForSelector(this.store.selectors().getCategoryBlock(), {timeout: 1000000})
        }*/
    }

    private async categoryPageCrawl(): Promise<boolean> {
        try {
            await this.page.waitForSelector(this.store.selectors().getCategoryBlock(), {timeout: 5000})
            await this.categoryNavScrape()
            return true
        } catch (e: any) {
            return false
        }
    }

    private categoryNavScrape = async () => {
        try {
            const categories = await this.getCategories()

            for (let i = 0; i < categories.length; i++) {
                // @ts-ignore
                this.url = categories[i]
                // @ts-ignore
                if (!Url.isValidHttpUrl(categories[i])) {
                    this.url = this.store.getUrl() + categories[i]
                }
                await this.crawl()
            }
        } catch (e: any) {
            console.log("Error categoryNavScrape method")
            console.log(e.message)
        }
    }

    private getCategories = async () => {
        const categories = await this.page.$$eval(this.store.selectors().getCategoryBlock(), (links) =>
            links.map((link) => {
                if (link.hasAttribute('href')) return link.getAttribute('href')

                const linkElems = link.querySelectorAll('a')
                for (let i = 0; i < linkElems.length; i++) {
                    return linkElems[i].getAttribute('href')
                }
            })
        );

        return categories
    }
}