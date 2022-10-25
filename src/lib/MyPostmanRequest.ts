import { URL } from 'url'
import cheerio from 'cheerio'
// @ts-ignore
import request from 'request-promise'
import { TypePostmanReq } from '../@types/TypePostmanReq'
import * as Cheerio from 'cheerio'

export default class MyPostmanRequest {
    static async request(url: string, isBan = false): Promise<TypePostmanReq> {
        let headersRes = {}
        let errorRes = false
        let bodyRes = Cheerio.load('')

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

        await proxyRequest(options, (error: any, response: any, body: any) => {
            errorRes = !!error

            if (!error && response.statusCode == 200) {
                headersRes = response.headers
                bodyRes = cheerio.load(body)
            } else {
                console.log('<<<< ERROR => ' + response.statusCode + ' >>>>')
                // console.log(error, response, body)
            }
        })

        return {
            $: bodyRes,
            error: errorRes,
            headers: headersRes,
        }
    }
}
