import { CheerioAPI } from 'cheerio'

export type TypePostmanReq = {
    $: CheerioAPI
    headers: object
    body: string
    error: boolean
}
