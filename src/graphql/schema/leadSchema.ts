import { gql } from 'apollo-server'

const leadSchema = gql`
    type Lead {
        _id: ID
        isMatch: String
        profit: Float
        roi: Float
        source: Source!
        amazon: Amazon!
    }

    input LeadInput {
        isMatch: String
        profit: Float
        roi: Float
        source: SourceInput!
        amazon: AmazonInput!
    }

    type LeadResponse {
        totalCount: Int!
        nodes: [Lead]
    }

    type CreateLeadResponse {
        status: Status!
        lead: Lead
    }
`

export default leadSchema
