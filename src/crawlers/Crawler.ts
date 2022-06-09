import ICrawler from "./ICrawler";
import IStore from "../stores/IStore";
import CrawlCategory from "./CrawlCategory";

class Crawler implements ICrawler {
    private readonly store
    constructor(store: IStore) {
        this.store = store
    }

    async crawl(): Promise<void> {
        const pageUrls = this.store.getCategoriesUrl()

        for (let i = 0; i < pageUrls.length; i++) {
            const crawlCategory = new CrawlCategory(this.store, pageUrls[i])
            try {
                await crawlCategory.crawl()
            } catch (e: any) {
                console.log('Error Crawl category: ' + pageUrls[i])
                console.log('Error message: ' + e.message)
                continue
            }
        }
    }
}

export default Crawler