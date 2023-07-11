import { gql } from 'apollo-server'

const querySchema = gql`
    type Query {
        #        getSourceById(_id: ID!): Source
        #        getSources(first: Int!, offset: Int!, where: SourceEditInput): SourceResponse!
        #        getAmazons(amount: Int): [Amazon]
        #        getLeads(first: Int!, offset: Int!, where: SourceEditInput): LeadResponse!
        getSourceById(_id: ID!): String
        getSources(first: Int!, offset: Int!, where: SourceEditInput): String!
        getAmazons(amount: Int): String
        getLeads(first: Int!, offset: Int!, where: SourceEditInput): String!
    }
`

export default querySchema
