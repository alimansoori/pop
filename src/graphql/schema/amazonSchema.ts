import { gql } from 'apollo-server'

const amazonSchema = gql`
    type Amazon {
        _id: ID!
        title: String
        asin: String!
        url: String
        price: Int
        numPack: Int
        category: String
        upc: [String]
        seller: String
        bsr: Int
        mSales: Int
        createdAt: String
        updatedAt: String
        leads: [Lead!]
    }

    input AmazonInput {
        title: String
        url: String
        asin: String!
        numPack: Int
        price: Int
        category: String
        upc: [String]
        seller: String
        bsr: Int
        mSales: Int
        createdAt: String
        updatedAt: String
        leads: [String!]
    }

    input AmazonEditInput {
        title: String
        url: String
        asin: String
        numPack: Int
        price: Int
        category: String
        upc: [String]
        seller: String
        bsr: Int
        mSales: Int
        createdAt: String
        updatedAt: String
        leads: [String!]
    }

    type CreateAmazonResponse {
        status: Status!
        amazon: Amazon
    }
`

export default amazonSchema
