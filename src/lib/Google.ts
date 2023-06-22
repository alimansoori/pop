import { GoogleInputType } from '../@types/GoogleInputType'
import { MyPuppeteer } from './MyPuppeteer'
// @ts-ignore
import { Browser, Page } from 'zyte-smartproxy-puppeteer'
import axios from 'axios'

export default class Google {
    page!: Page
    browser!: Browser
    private input: GoogleInputType
    asin: string[] = []
    amazonUrl = ''
    searchQuery = 'site:amazon.com '

    constructor(input: GoogleInputType) {
        this.input = input
        this.searchQuery = this.searchQuery + this.prettyTitle()
        console.log(this.searchQuery)
    }

    private prettyTitle(): string {
        let title: string = this.input.title
        title = title.trim()
        title = title.toLowerCase()
        title = title.replace(' - ', ' ')
        title = title.replace(', ', ' ')
        title = title.replace(',', ' ')
        title = title.replace(' ) ', ' ')
        title = title.replace(')', '')
        title = title.replace(' ( ', ' ')
        title = title.replace('(', '')
        title = title.replace('. ', ' ')
        title = title.replace('" ', '')
        title = title.replace(' "', '')
        title = title.replace(': ', ' ')
        title = title.replace(/[0-9]{1,}(\s?|\/)(pack|pk)(\s?)/gi, '')
        title = title.replace(/(\s?)(pack of )[0-9]{1,}/gi, '')
        title = title.replace(/(\s?)(case of )[0-9]{1,}/gi, '')
        title = title.replace(/(\s?)(arrive in .* days)/gi, '')

        return title
    }

    async search2() {
        await this.createBrowser()

        try {
            await this.page.goto('https://www.bing.com/search?q=' + encodeURIComponent(this.searchQuery), {
                waitUntil: 'load',
            })

            /*await this.page.waitForSelector('input[type="search"][name="q"][id="sb_form_q"]', { visible: true })
            await this.page.type('input[type="search"][name="q"][id="sb_form_q"]', this.searchQuery, { delay: 50 })
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                this.page.keyboard.press('Enter'),
            ])*/
            await this.page.waitForSelector('ol[id="b_results"] li.b_algo h2 > a', { visible: true })
            const searchResults: string[] = await this.page.$$eval('ol[id="b_results"] li.b_algo h2 > a', (el: any) =>
                el.map((x: any) => x.getAttribute('href'))
            )

            for (let i = 0; i < searchResults.length; i++) {
                if (
                    searchResults[i].startsWith('https://amazon.com') ||
                    searchResults[i].startsWith('https://www.amazon.com')
                ) {
                    if (!Google.extractASIN(searchResults[i])) continue
                    this.amazonUrl = searchResults[i]
                    this.asin.push(Google.extractASIN(searchResults[i]))
                }
            }

            await this.browser?.close()
        } catch (e) {
            await this.browser?.close()
        }

        /*await this.page.waitForSelector('div[id="search"] a')

        const attr: string[] = await this.page.$$eval('div[id="search"] a', (el: any) =>
            el.map((x: any) => x.getAttribute('href'))
        )

        for (let i = 0; i < attr.length; i++) {
            if (attr[i].startsWith('https://amazon.com') || attr[i].startsWith('https://www.amazon.com')) {
                if (!Google.extractASIN(attr[i])) continue
                this.amazonUrl = attr[i]
                this.asin = Google.extractASIN(attr[i])
                break
            }
        }*/
    }

    async search() {
        const data = JSON.stringify({
            q: this.searchQuery,
            gl: 'us',
            hl: 'en',
            autocorrect: true,
        })

        const config = {
            method: 'post',
            url: 'https://google.serper.dev/search',
            headers: {
                'X-API-KEY': '8fe5310ce48903b34d5afe234cb1917859325d68',
                'Content-Type': 'application/json',
            },
            data: data,
        }

        const response = await axios(config)
        const searchResults = response.data['organic']
        for (let i = 0; i < searchResults.length; i++) {
            if (
                searchResults[i]['link'].startsWith('https://amazon.com') ||
                searchResults[i]['link'].startsWith('https://www.amazon.com')
            ) {
                if (!Google.extractASIN(searchResults[i]['link'])) continue
                this.amazonUrl = searchResults[i]['link']
                this.asin.push(Google.extractASIN(searchResults[i]['link']))
                break
            }
        }
    }

    getAsins(): string[] {
        return this.asin
    }

    async createBrowser(): Promise<void> {
        try {
            const pup = new MyPuppeteer(false, false)
            await pup.build()
            this.browser = pup.browser
            this.page = await this.browser.newPage()

            await this.page.setViewport({ width: 1440, height: 900 })
            // this.page = (await this.browser.pages())[0]

            /*await this.page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
            )*/

            await this.page.setExtraHTTPHeaders({
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Sec-Ch-Ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                'X-Amzn-Trace-Id': 'Root=1-63e76bf8-75ffdab9287662da61df55bd',
            })
        } catch (e) {
            throw new Error('create browser faild')
        }
    }

    private static extractASIN(url: string) {
        const ASINreg = new RegExp(/(\/dp)(?:\/)([A-Z0-9]{10})(?:$|\/|\?)/)
        const cMatch = url.match(ASINreg)
        if (cMatch === null) {
            return ''
        }
        return cMatch[2]
    }
}
