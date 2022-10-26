import { CheerioAPI } from 'cheerio'
import axios from 'axios'

export default class WebScrapingApi {
    private pageSource = ''
    private key = 'Qh6v8E47BWLM7kYPR9RRDi4zJRY3KYYT'
    $: CheerioAPI | null = null

    constructor() {}

    async fetch(url: string): Promise<void> {
        /*const res = await request.get(
            `https://api.webscrapingapi.com/v1?url=${encodeURIComponent(url)}&api_key=${
                this.key
            }&device=desktop&proxy_type=datacenter&country=us&render_js=1&wait_until=load&timeout=60000`
        )
        this.$ = cheerio.load(res)

        console.log(this.$('h1'))*/

        axios
            .get('https://api.ipify.org/?format=json', {
                proxy: {
                    host: 'proxy.webscrapingapi.com',
                    port: 8000,
                    auth: {
                        username: 'webscrapingapi.proxy_type=datacenter.device=desktop',
                        password: this.key,
                    },
                },
            })
            .then(
                function (response) {
                    // console.log(response.data)
                    // const $ = cheerio.load(response.data.data)

                    console.log(response.data.data)
                },
                (err) => {
                    console.log(err)
                }
            )
    }
}
