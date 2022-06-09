import ICrawler from "./ICrawler";

export default class CrawlDetails implements ICrawler {
    constructor(url: string) {
    }

    async crawl(): Promise<void> {
    }
}