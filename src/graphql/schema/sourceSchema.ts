import { gql } from 'apollo-server'

const sourceSchema = gql`
    type Source {
        _id: ID!
        title: String
        url: String!
        siteName: String
        price: Float
        numPack: Int
        brand: String
        upc: String
        model: String
        availability: Boolean
        images: [String]
        statusCode: Int
        createdAt: String
        updatedAt: String
        #        leads: [Lead!]
    }

    input SourceInput {
        title: String
        url: String!
        siteName: String
        price: Float
        numPack: Int
        brand: String
        upc: String
        model: String
        availability: Boolean
        images: [String]
        statusCode: Int
        #        leads: [LeadInput]
    }

    input SourceEditInput {
        title: String
        url: String
        siteName: String
        price: Float
        numPack: Int
        brand: String
        upc: String
        model: String
        availability: Boolean
        images: [String]
        statusCode: Int
        #        leads: [LeadInput]
    }

    type CreateSourceResponse {
        status: Status!
        source: Source
    }

    type SourceResponse {
        totalCount: Int!
        nodes: [Source]
    }
`

export default sourceSchema
