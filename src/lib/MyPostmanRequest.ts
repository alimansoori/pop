import cheerio from 'cheerio'
// @ts-ignore
import request from 'postman-request'
import { TypePostmanReq } from '../@types/TypePostmanReq'
import fs from 'fs'
import { sleep } from '../utils/sleep'

export default class MyPostmanRequest {
    static async request2(url: string, isBan = false): Promise<TypePostmanReq> {
        const res = {
            $: cheerio.load(''),
            error: false,
            body: '',
            headers: {},
        }
        // let statusCode = NaN

        let proxy = null
        if (isBan) {
            proxy = 'http://d8fdd1a5127c40049468dafcf932af8c:@proxy.crawlera.com:8011'
        }

        const proxyRequest = await request.defaults({
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
                    res.body = JSON.stringify(body)
                    console.log(JSON.stringify(body))
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

    static async request(url: string, isBan = false): Promise<TypePostmanReq> {
        const proxyRequest = request.defaults({
            proxy: 'http://d8fdd1a5127c40049468dafcf932af8c:@proxy.crawlera.com:8011',
        })

        const res = {
            $: cheerio.load(''),
            error: false,
            body: '',
            headers: {},
        }

        const options = {
            url: url,
            ca: fs.readFileSync('config/zyte-proxy-ca.crt'),
            requestCert: true,
            rejectUnauthorized: true,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Sec-Ch-Ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'X-Amzn-Trace-Id': 'Root=1-640cd547-789a941039ffdd9e5f99ee2a',
            },
        }

        proxyRequest(options, (error: any, response: any, body: any) => {
            if (!error && response.statusCode == 200) {
                res.headers = response.headers
                res.$ = cheerio.load(body)
                res.body = JSON.stringify(body)
            } else {
                console.log('Error in MyPostmanRequest class')
                console.log(error.message)
            }
            return body
        })

        await sleep(10000)

        return res
    }
}
