import cheerio from 'cheerio'
// @ts-ignore
import request from 'request-promise'
import { TypePostmanReq } from '../@types/TypePostmanReq'
import { headers } from 'zyte-smartproxy-puppeteer'

export default class MyPostmanRequest {
    static async request(url: string, isBan = false): Promise<TypePostmanReq> {
        const res = {
            $: cheerio.load(''),
            error: false,
            headers: {},
        }
        // let statusCode = NaN

        let proxy = null
        if (isBan) {
            proxy = 'http://d8fdd1a5127c40049468dafcf932af8c:@proxy.crawlera.com:8011'
        }

        const proxyRequest = request.defaults({
            proxy,
        })

        const options = {
            url: url,
            requestCert: true,
            rejectUnauthorized: false,
        }

        try {
            await proxyRequest(options, (error: any, response: any, body: any) => {
                res.error = !!error
                // const statusCode = response?.statusCode

                if (!error && response.statusCode === 200) {
                    res.headers = response.headers
                    res.$ = cheerio.load(body)
                } else {
                    console.log('<<<< ERROR => ' + response?.statusCode + ' >>>>')
                    // console.log(error, response, body)
                }
            })
        } catch (e: any) {
            /*if (counter === 1) {
                console.log('<<<< REPEAT REQUEST >>>>')
                res = await MyPostmanRequest.request(url, true, 2)
            }*/
        }

        return res
    }
}
