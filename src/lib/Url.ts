import {URL} from "url";

export default class Url {
    static getDomain(url: string): string | undefined {
        const regex_var = new RegExp(/(\.[^\.]{0,2})(\.[^\.]{0,2})(\.*$)|(\.[^\.]*)(\.*$)/);
        return ((new URL(url)).hostname).replace(regex_var, '').split('.').pop();
    }

    static insertParam(url: string, key: string, value: string): string {
        const newUrl = new URL(url)
        const search_params = newUrl.searchParams
        search_params.set(key, value)
        newUrl.search = search_params.toString()

        return newUrl.toString()
    }

    static isValidHttpUrl(url: string): boolean {

        let newUrl
        try {
            newUrl = new URL(url);
        } catch (_) {
            return false;
        }

        return newUrl.protocol === "http:" || newUrl.protocol === "https:";
    }
    static amazonUrlByAsin(asin: string): string {
        return `https://amazon.com/dp/${asin}`
    }

}