import { Page } from 'puppeteer'

export class MyPuppeteerCalculate {
    static async findElementByContent(page: Page, content: string): Promise<boolean> {
        const foundElement = await page.evaluate((content) => {
            const elements = document.querySelectorAll('*')
            for (const element of elements) {
                if (element?.textContent?.includes(content)) {
                    return element
                }
            }
            return null
        }, content)

        return !!foundElement
    }
}
