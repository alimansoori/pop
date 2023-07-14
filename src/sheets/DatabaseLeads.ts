import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { keys } from '../keys'
import SourceSiteFactory from '../stores/SourceSiteFactory'
import IStore from '../stores/IStore'
import Keepa from '../lib/Keepa'
import MyDate from '../lib/MyDate'
import { tomorrowDate, writeSetting } from '../lib/helper'
import CategorySheet from '../lib/CategorySheet'
import { sleep } from '../utils/sleep'
import { DbApi } from '../lib/db-api/DbApi'
import axios from 'axios'
import { ILead } from '../models/LeadModel'

export default class DatabaseLeads {
    private leads: any = ''
    private dataBaseLeads: any = ''

    async auth() {
        try {
            this.leads = new GoogleSpreadsheet(CategorySheet.selectSheetKey('leads'))

            await this.leads.useServiceAccountAuth({
                client_email: keys.client_email,
                private_key: keys.private_key,
            })

            await this.leads.loadInfo()
            this.dataBaseLeads = await this.leads.sheetsByTitle.data

            await this.dataBaseLeads.setHeaderRow([
                'Date',
                'Status',
                'Approval',
                'Title',
                'Asin',
                'Source',
                'Source_URL',
                'Amazon_URL',
                'Amazon_Number',
                'Brand',
                'Category',
                'Signature',
                'Note',
            ])
        } catch (e: any) {
            console.log('Error to connect Database Leads')
            console.log(e.message)
        }
    }

    currentDate(): string {
        const ddd = new Date()
        const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(ddd)
        const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(ddd)
        const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(ddd)

        return `${month}/${day}/${year}`
    }

    async sourceSite(url: string): Promise<IStore> {
        const store = await SourceSiteFactory.create(url)
        console.log(store.getDomain())

        return store
    }

    async addToSheet(lead: ILead) {
        if (lead.profit > 4 && lead.roi > 25) {
            // Add Row in DataBase Leads
            await this.dataBaseLeads.addRow({
                Date: new Date().toLocaleDateString('en-US'),
                Status: lead.status === 'match' ? 'Match' : '',
                Approval: '',
                Title: lead.source.title,
                Asin: lead.amazon.asin,
                // @ts-ignore
                Source: '',
                Source_URL: lead.source.url,
                Amazon_URL: lead.amazon.url,
                Amazon_Number: '',
                Brand: lead.source.brand,
                Category: lead.amazon.category,
                Signature: '',
                Note: 'From new bot',
            })
        }
    }
}
