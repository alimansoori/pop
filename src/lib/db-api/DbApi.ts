import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export class DbApi {
    private readonly baseUrl: string
    private readonly authToken: string

    constructor(baseUrl: string, authToken: string) {
        this.baseUrl = baseUrl
        this.authToken = authToken
    }

    public async get<T>(url: string, queryParams?: any): Promise<T> {
        try {
            const config: AxiosRequestConfig = {
                method: 'get',
                url: this.baseUrl + url,
                headers: {
                    Authorization: 'Bearer ' + this.authToken,
                },
                params: queryParams,
            }

            const response: AxiosResponse<T> = await axios(config)
            return response.data
        } catch (error) {
            throw DbApi.handleAxiosError(error)
        }
    }

    public async post<T>(url: string, data: any): Promise<T> {
        try {
            const config: AxiosRequestConfig = {
                method: 'post',
                url: this.baseUrl + url,
                headers: {
                    Authorization: 'Bearer ' + this.authToken,
                },
                data: data,
            }

            const response: AxiosResponse<T> = await axios(config)
            return response.data
        } catch (error) {
            throw DbApi.handleAxiosError(error)
        }
    }

    public async put<T>(url: string, data: any): Promise<T> {
        try {
            const config: AxiosRequestConfig = {
                method: 'put',
                url: this.baseUrl + url,
                headers: {
                    Authorization: 'Bearer ' + this.authToken,
                },
                data: data,
            }

            const response: AxiosResponse<T> = await axios(config)
            return response.data
        } catch (error) {
            throw DbApi.handleAxiosError(error)
        }
    }

    public async delete<T>(url: string): Promise<T> {
        try {
            const config: AxiosRequestConfig = {
                method: 'delete',
                url: this.baseUrl + url,
                headers: {
                    Authorization: 'Bearer ' + this.authToken,
                },
            }

            const response: AxiosResponse<T> = await axios(config)
            return response.data
        } catch (error) {
            throw DbApi.handleAxiosError(error)
        }
    }

    private static handleAxiosError(error: any): Error {
        if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            const status = error.response.status
            const message = error.response.data || error.response.statusText
            return new Error(`Request failed with status code ${status}: ${message}`)
        } else if (error.request) {
            // The request was made but no response was received
            return new Error('No response received from the server')
        } else {
            // Something happened in setting up the request that triggered an Error
            return new Error('Error setting up the request: ' + error.message)
        }
    }

    async getProductByTitle(input: IProductSearchInput): Promise<IProductSearchOutput[]> {
        try {
            return await this.get('/product/search', {
                search: input.search,
            })
        } catch (e: any) {
            console.error(e.message)
            return []
        }
    }

    async addProduct(input: IProductInput): Promise<void> {
        try {
            const response = await this.post('/product', input)
            console.log('Product added successfully:', response)
        } catch (e: any) {
            console.error('Error adding product:', e)
            throw new Error('Failed to add product')
        }
    }

    static async addProductFromGoogleSheet(input: IProductInput): Promise<void> {
        const dbApi = new DbApi('http://199.244.49.112:8080/api', '')

        await dbApi.addProduct(input)
    }
}
