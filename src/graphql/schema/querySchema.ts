import { gql } from 'apollo-server'

const querySchema = gql`
    type Query {
        getSourceById(_id: ID!): Source
        getSources(first: Int!, offset: Int!, where: SourceEditInput): SourceResponse!
        getAmazons(amount: Int): [Amazon]
        getLeads(first: Int!, offset: Int!, where: SourceEditInput): LeadResponse!
    }
`

export default querySchema
